<?php
defined('_JEXEC') or die;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
$db = JFactory::getDbo();

switch(JRequest::getVar('act')){
  case 'getProducts':{
    $query = $db->getQuery(true);
    $query->select('product_txt.*');
    $query->select('product.published');
    $query->from($db->quoteName('#__virtuemart_products').' AS product');
    $query->join('LEFT',$db->quoteName('#__virtuemart_products_ru_ru').' AS product_txt ON product_txt.virtuemart_product_id=product.virtuemart_product_id');
    if(JRequest::getInt('cat')>0){
      $query->join('LEFT','#__virtuemart_product_categories AS cat ON cat.virtuemart_product_id = product.virtuemart_product_id');
      $query->where('cat.virtuemart_category_id = '. JRequest::getInt('cat'));
    }
    else{
      $query->join('LEFT','#__virtuemart_product_categories AS cat ON cat.virtuemart_product_id = product.virtuemart_product_id');
      $query->where('cat.virtuemart_product_id IS NULL');
    }
    $query->order('product_txt.product_name ASC');
    // $query->setLimit('200');
    $db->setQuery($query,JRequest::getInt('start'),20);
    $results = $db->loadObjectList();
    $products = array();
    foreach ($results as $key => $value) {
      $products []= array(
        'name'=>$value->product_name,
        'state'=>$value->published
      );
    }
    echo json_encode($products);
    break;
  }
  case 'getCategories':{
    $query = $db->getQuery(true);
    $query->select(array('cat_txt.*,cat_cat.category_parent_id,cat.published'));
    $query->select('(SELECT COUNT(*) FROM #__virtuemart_product_categories AS prod_cat WHERE prod_cat.virtuemart_category_id=cat_txt.virtuemart_category_id) AS countProds');
    $query->from($db->quoteName('#__virtuemart_categories_ru_ru').' AS cat_txt');
    $query->join('LEFT','#__virtuemart_category_categories AS cat_cat ON cat_txt.virtuemart_category_id = cat_cat.category_child_id');
    $query->join('LEFT','#__virtuemart_categories AS cat ON cat.virtuemart_category_id = cat_cat.category_child_id');
    $query->order('cat_txt.category_name ASC');
    $db->setQuery($query);
    $results = $db->loadObjectList();
    $categories = array();
    foreach ($results as $key => $value) {
      $categories[$value->category_parent_id] []= array(
        'id'=>$value->virtuemart_category_id,
        'name'=>$value->category_name,
        'countProds'=>$value->countProds,
        'state'=>$value->published
      );
    }
    $categories = createTree($categories, $categories[0]);
    $categories = createTreeToList($categories, '/');

    echo json_encode($categories);
    break;
  }
  case 'getOrders':{
    $query = $db->getQuery(true);
    $query->select(array('o.*,c.currency_symbol,ou.first_name,ou.last_name,ou.phone_1,ou.email'));
    $query->from($db->quoteName('#__virtuemart_orders').' AS o');
    $query->join('LEFT','#__virtuemart_currencies AS c ON c.virtuemart_currency_id = o.order_currency');
    $query->join('LEFT','#__virtuemart_order_userinfos AS ou ON ou.virtuemart_order_id = o.virtuemart_order_id');
    $query->order('o.virtuemart_order_id DESC');
    $db->setQuery($query,JRequest::getInt('start'),10);
    $results = $db->loadObjectList();

    $orders = array();
    $orderItems = array();
    $ordersIds = array();
    $currencySymbol = '';
    // Pending - P
    // Confirmed by Shopper - U
    // Confirmed - C
    // Cancelled - X
    // Refunded - R
    // Shipped - S
    foreach ($results as $key => $value) {
      $currencySymbol = $value->currency_symbol;
      $orders [] = array(
        'id'=>$value->virtuemart_order_id,
        'name'=>$value->order_number,
        'state'=>$value->order_status,
        'price'=>number_format($value->order_total,2,'.',' ').' '.$currencySymbol,
        'date'=>date("d M 'y, H:i",strtotime($value->created_on)),
        'items'=>array()
      );
      $ordersIds []= $value->virtuemart_order_id;
    }

    $query = $db->getQuery(true);
    $query->select(array('oi.virtuemart_order_id,oi.order_item_name,oi.product_quantity,oi.product_final_price,oi.product_subtotal_with_tax,oi.virtuemart_order_item_id'));
    // $query->select('(SELECT COUNT(*) FROM #__virtuemart_product_categories AS prod_cat WHERE prod_cat.virtuemart_category_id=cat_txt.virtuemart_category_id) AS countProds');
    $query->from('#__virtuemart_order_items AS oi');
    $query->where('oi.virtuemart_order_id IN ('.implode(',',$ordersIds).')');
    $db->setQuery($query);
    $results = $db->loadObjectList();

    foreach($results as $key => $value){
      $orderItems [$value->virtuemart_order_id][]= array(
        'id'=>$value->virtuemart_order_item_id,
        'name'=>$value->order_item_name,
        'quantity'=>$value->product_quantity,
        'price'=>number_format($value->product_final_price,2,'.',' ').' '.$currencySymbol,
        'priceTotal'=>number_format($value->product_subtotal_with_tax,2,'.',' ').' '.$currencySymbol
      );
    }
    
    foreach($orders as $key => $value) {
      $orders[$key]['items'] = $orderItems[$value['id']];
    }

    echo json_encode($orders);
    break;
  }
  case 'getStats':{
    $incomes = array();
    $incomesTmp = array();
    $years = array();

    $query = $db->getQuery(true);
    $query->select(array('c.currency_symbol, MONTHNAME(o.created_on) AS month, SUM(o.order_total) AS total, YEAR(o.created_on) AS year'));
    $query->from($db->quoteName('#__virtuemart_orders').' AS o');
    $query->join('LEFT','#__virtuemart_currencies AS c ON c.virtuemart_currency_id = o.order_currency');
    $query->order('YEAR(o.created_on) DESC, MONTH(o.created_on) ASC');
    $query->group('YEAR(o.created_on), MONTH(o.created_on)');
    $db->setQuery($query);
    $results = $db->loadObjectList();
    $currency = '';
    foreach ($results as $key => $value) {
      $currency = $value->currency_symbol;
      $incomesTmp[$value->year]['months'][] = $value->month;
      $incomesTmp[$value->year]['totals'][] = ceil($value->total);
      $incomesTmp[$value->year]['total'] += $value->total;
      $years[] = $value->year;
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
      $incomes[$value]['total'] = number_format($incomesTmp[$value]['total'],0,'.',' ').' '.$currency;
    }

    $orders = array();
    $query = $db->getQuery(true);
    $query->select(array('COUNT(*) AS states, order_status'));
    $query->from($db->quoteName('#__virtuemart_orders'));
    $query->group('order_status');
    $db->setQuery($query);
    $results = $db->loadObjectList();
    // $currency = '';
    foreach ($results as $key => $value) {
      $orders['labels'][] = $value->order_status;
      $orders['data'][] = $value->states;
    }

    echo json_encode(array(
      'incomes'=>$incomes,
      'incomesYears'=>$years,
      'orders'=>$orders
    ));
    break;
  }
  case 'getBuyers':{
    $query = $db->getQuery(true);
    $query->select('DISTINCT ou.email');
    $query->select(array(
      'c.currency_symbol',
      'ou.first_name',
      'ou.last_name',
      'ou.phone_1',
      'ou.email'
      )
    );
    $query->select('(SELECT SUM(oa.order_total) FROM #__virtuemart_orders oa WHERE oa.virtuemart_order_id=ou.virtuemart_order_id) AS orders_amount');
    $query->select('(SELECT COUNT(*) FROM #__virtuemart_orders o2 WHERE o2.virtuemart_order_id=ou.virtuemart_order_id) AS orders_quantity');
    $query->from($db->quoteName('#__virtuemart_order_userinfos').' AS ou');
    $query->join('LEFT','#__virtuemart_orders o ON o.virtuemart_order_id = ou.virtuemart_order_id');
    $query->join('LEFT','#__virtuemart_currencies c ON c.virtuemart_currency_id = o.order_currency');
    $query->order('ou.first_name ASC');
    $db->setQuery($query,JRequest::getInt('start'),10);
    $results = $db->loadObjectList();

    $buyers = array();
    $orderItems = array();
    $ordersIds = array();
    $currencySymbol = '';

    foreach ($results as $key => $value) {
      $currencySymbol = $value->currency_symbol;
      $buyers [] = array(
        'name'=>$value->first_name.' '.$value->last_name,
        'email'=>$value->email,
        'phone'=>$value->phone_1,
        'orderscost'=>number_format($value->orders_amount,2,'.',' ').' '.$currencySymbol,
        'orders'=>$value->orders_quantity
      );
    }

    echo json_encode($buyers);
    break;
  }
}

function createTree(&$list, $parent){
  $tree = array();
  foreach ($parent as $k=>$l){
    if(isset($list[$l['id']])){
      $l['children'] = createTree($list, $list[$l['id']]);
    }
    $tree[] = $l;
  } 
  return $tree;
}

function createTreeToList(&$list, $prefix){
  $tree = array();
  foreach ($list as $k=>$l){
    $l['name'] = $prefix.$l['name'];
    $tree[] = $l;
    if(count($l['children'])>0){
      $tmp = createTreeToList($l['children'], $prefix.' - /');
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

jexit();
?>