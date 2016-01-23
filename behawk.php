<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

class ControllerProductBehawk extends Controller {
	private $error = array(); 
	
	public function get(){
		switch($this->request->post['act']){
			case 'getStats':{
				$incomes = array();
				$incomesTmp = array();
				$years = array();

				$query = $this->db->query("SELECT c.symbol_left,c.symbol_right,
						MONTHNAME(o.date_added) AS month,
						SUM(o.total) AS total,
						YEAR(o.date_added) AS year
					FROM ".DB_PREFIX."order AS o
					LEFT JOIN ".DB_PREFIX."currency AS c ON c.code LIKE o.currency_code
					ORDER BY YEAR(o.date_added) DESC, MONTH(o.date_added) ASC
					");
				$results = $query->rows;

				$currencyLeft = '';
				$currencyRight = '';
				foreach ($results as $key => $value) {
					$currencyLeft = $value['symbol_left'];
					$currencyRight = $value['symbol_right'];
					$incomesTmp[$value['year']]['months'][] = $value['month'];
					$incomesTmp[$value['year']]['totals'][] = ceil($value['total']);
					$incomesTmp[$value['year']]['total'] += $value['total'];
					$years[] = $value['year'];
				}
				$years = array_unique($years);
				foreach ($years as $key => $value) {
					for($i=1;$i<=12;$i++){
						$date = $value.'-'.( $i>9 ? $i : '0'.$i ).'-01 12:00:00';
						$month = date('F',strtotime(date($date)));
						if(in_array($month, $incomesTmp[$value]['months'])){
							$k = array_search($month, $incomesTmp[$value]['months']);
							$incomes[$value]['months'][] = $incomesTmp[$value]['months'][$k];
							$incomes[$value]['totals'][] = $incomesTmp[$value]['totals'][$k];
						}
						else{
							$incomes[$value]['months'][] = $month;
							$incomes[$value]['totals'][] = 0;
						}
					}
					$incomes[$value]['total'] = $currencyLeft.''.number_format($incomesTmp[$value]['total'],0,'.',' ').' '.$currencyRight;
				}

				$orders = array();
				$orderState = array(
					'1' => 'P',
					'2' => 'U',
					'3' => 'S',
					'5' => 'S',
					'7' => 'X',
					'8' => 'X',
					'9' => 'X',
					'10' => 'X',
					'11' => 'R',
					'12' => 'X',
					'13' => 'R',
					'14' => 'X',
					'15' => 'C',
					'16' => 'X'
				);

				$query = $this->db->query("SELECT COUNT(*) AS states,order_status_id
					FROM ".DB_PREFIX."order
					GROUP BY order_status_id
					");
				$results = $query->rows;

				foreach ($results as $key => $value) {
					$orders['labels'][] = $orderState[$value['order_status_id']];
					$orders['data'][] = $value['states'];
				}

				echo json_encode(array(
					'incomes'=>$incomes,
					'incomesYears'=>$years,
					'orders'=>$orders
				));
				break;
			}
			case 'getProducts':{
				$query = $this->db->query("SELECT product_txt.*,product.status
					FROM ".DB_PREFIX."product AS product
					LEFT JOIN ".DB_PREFIX."product_description AS product_txt ON product_txt.product_id=product.product_id
					".((int)$this->request->post['cat']>0?"
						LEFT JOIN ".DB_PREFIX."product_to_category AS cat ON cat.product_id = product.product_id
						WHERE cat.category_id = ".$this->request->post['cat']."
						":"
						LEFT JOIN ".DB_PREFIX."product_to_category AS cat ON cat.product_id = product.product_id
						WHERE cat.category_id IS NULL
						")."
					ORDER BY product_txt.name ASC
					LIMIT ".$this->request->post['start'].",20
					");
				$results = $query->rows;
				$products = array();
				foreach ($results as $key => $value) {
					$products []= array(
						'name'=>$value['name'],
						'state'=>$value['status']
					);
				}
				echo json_encode($products);
				break;
			}
			case 'getCategories':{
				$query = $this->db->query("SELECT cat_txt.*,cat.parent_id,cat.status,
					(SELECT COUNT(*) FROM ".DB_PREFIX."product_to_category AS prod_cat WHERE prod_cat.category_id=cat_txt.category_id) AS countProds
					FROM ".DB_PREFIX."category_description AS cat_txt
					LEFT JOIN ".DB_PREFIX."category AS cat ON cat.category_id=cat_txt.category_id
					ORDER BY cat_txt.name ASC
					");
				$results = $query->rows;
				$categories = array();
				foreach ($results as $key => $value) {
					$categories[$value['parent_id']] []= array(
						'id'=>$value['category_id'],
						'name'=>$value['name'],
						'countProds'=>$value['countProds'],
						'state'=>$value['status']
					);
				}
				$categories = $this->createTree($categories, $categories[0]);
				$categories = $this->createTreeToList($categories, '/');

				echo json_encode($categories);
				break;
			}
			case 'getOrders':{
				$query = $this->db->query("SELECT o.*,c.symbol_left,c.symbol_right
					FROM ".DB_PREFIX."order AS o
					LEFT JOIN ".DB_PREFIX."currency AS c ON c.code LIKE o.currency_code
					ORDER BY o.order_id DESC
					LIMIT ".$this->request->post['start'].",20
					");
				$results = $query->rows;

				$orders = array();
				$orderItems = array();
				$ordersIds = array();
				$currencySymbolLeft = '';
				$currencySymbolRight = '';
				$orderState = array(
					'1' => 'P',
					'2' => 'U',
					'3' => 'S',
					'5' => 'S',
					'7' => 'X',
					'8' => 'X',
					'9' => 'X',
					'10' => 'X',
					'11' => 'R',
					'12' => 'X',
					'13' => 'R',
					'14' => 'X',
					'15' => 'C',
					'16' => 'X'
				);

				// P - Pending
				// U - Confirmed by Shopper
				// C - Confirmed
				// X - Cancelled
				// R - Refunded
				// S - Shipped

				// P 1  'Pending'
				// U 2  'Processing'
				// S 3  'Shipped'
				// S 5  'Complete'
				// X 7  'Canceled'
				// X 8  'Denied'
				// X 9  'Canceled Reversal'
				// X 10 'Failed'
				// R 11 'Refunded'
				// X 12 'Reversed'
				// R 13 'Chargeback'
				// X 14 'Expired'
				// C 15 'Processed'
				// X 16 'Voided'

				foreach ($results as $key => $value) {
					$currencySymbolLeft = $value['symbol_left'];
					$currencySymbolRight = $value['symbol_right'];
					$orders [] = array(
						'id'=>$value['order_id'],
						'oid'=>$value['order_id'],
						'state'=>$orderState[$value['order_status_id']],
						'price'=>$currencySymbolLeft.''.number_format($value['total'],2,'.',' ').' '.$currencySymbolRight,
						'date'=>date("d M 'y, H:i",strtotime($value['date_added'])),
						'name'=>$value['firstname'].' '.$value['lastname'],
						'email'=>$value['email'],
						'phone'=>$value['telephone'],
						'items'=>array()
					);
					$ordersIds []= $value['order_id'];
				}

				$query = $this->db->query("SELECT op.order_id,op.order_product_id,op.name,op.quantity,op.price,op.total
					FROM ".DB_PREFIX."order_product AS op
					WHERE op.order_id IN (".implode(',',$ordersIds).")
					");
				$results = $query->rows;

				foreach($results as $key => $value){
					$orderItems [$value['order_id']][]= array(
						'id'=>$value['order_product_id'],
						'name'=>$value['name'],
						'quantity'=>$value['quantity'],
						'price'=>$currencySymbolLeft.''.number_format($value['price'],2,'.',' ').' '.$currencySymbolRight,
						'priceTotal'=>$currencySymbolLeft.''.number_format($value['total'],2,'.',' ').' '.$currencySymbolRight
					);
				}
				
				foreach($orders as $key => $value) {
					$orders[$key]['items'] = $orderItems[$value['id']];
				}

				echo json_encode($orders);
				break;
			}
			case 'getBuyers':{
				$query = $this->db->query("SELECT
					o.email,o.telephone,o.firstname,o.lastname,c.symbol_left,c.symbol_right,o.order_id,
					SUM(o.total) AS total,
					COUNT(*) AS quantity
					
					FROM ".DB_PREFIX."order AS o
					LEFT JOIN ".DB_PREFIX."currency AS c ON c.code LIKE o.currency_code
					GROUP BY o.email,o.telephone
					ORDER BY o.firstname ASC,o.lastname ASC
					LIMIT ".$this->request->post['start'].",20
					");
				$results = $query->rows;

				$buyers = array();
				$orderItems = array();
				$ordersIds = array();
				$currencySymbol = '';

				foreach ($results as $key => $value) {
					$currencySymbolLeft = $value['symbol_left'];
					$currencySymbolRight = $value['symbol_right'];
					$buyers [] = array(
						'id'=>$value['order_id'],
						'name'=>$value['firstname'].' '.$value['lastname'],
						'email'=>$value['email'],
						'phone'=>$value['telephone'],
						'orderscost'=>$currencySymbolLeft.''.number_format($value['total'],2,'.',' ').' '.$currencySymbolRight,
						'orders'=>$value['quantity']
					);
				}

				echo json_encode($buyers);
				break;
			}
		}
	}
	private function createTree(&$list, $parent){
		$tree = array();
		foreach ($parent as $k=>$l){
			if(isset($list[$l['id']])){
				$l['children'] = $this->createTree($list, $list[$l['id']]);
			}
			$tree[] = $l;
		} 
		return $tree;
	}

	private function createTreeToList(&$list, $prefix){
		$tree = array();
		foreach ($list as $k=>$l){
			$l['name'] = $prefix.$l['name'];
			$tree[] = $l;
			if(count($l['children'])>0){
				$tmp = $this->createTreeToList($l['children'], $prefix.' - /');
				foreach ($tmp as $key => $value) {
					// $value['name'] = $prefix.$value['name'];
					$tree[] = $value;
				}
			}
			else{
			}
		} 
		return $tree;
	}
}
?>