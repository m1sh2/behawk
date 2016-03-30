<?php
session_start();
// $mysql_link = mysql_connect('datsko.mysql.ukraine.com.ua', 'datsko_todaynews', 'rvbef8vy');

require_once('./php/transliteration/JTransliteration.php');
require_once('./db.php');
/* return name of current default database */
// if ($result = $mysqli->query("SELECT DATABASE()")) {
//     $row = $result->fetch_row();
//     printf("Default database is %s.\n", $row[0]);
//     $result->close();
// }

/* change db to world db */
// $mysqli->select_db("datsko_todaynews");

/* return name of current default database */
// if ($result = $mysqli->query("SELECT DATABASE()")) {
//   $row = $result->fetch_row();
//   printf("Default database is %s.\n", $row[0]);
//   $result->close();
// }

$act = isset($_POST['act']) ? $_POST['act'] : $_GET['act'];
$act2 = isset($_POST['act2']) ? $_POST['act2'] : $_GET['act2'];
$act3 = isset($_POST['act3']) ? $_POST['act3'] : $_GET['act3'];

// echo json_encode([$_REQUEST, $act]);
// echo json_encode($_POST);
// echo $act;
// $data = json_decode(base64_decode($_REQUEST['data']));
// echo $utf->toAscii($data->title);
// exit();



function GUI($length = 32) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, $charactersLength - 1)];
  }
  return $randomString;
}

switch($act) {

  case 'save':
    $data = json_decode(base64_decode($_REQUEST['data']));
    switch ($act2) {

      case 'project':
        if ($data->id > 0) {
          $result = q("UPDATE projects SET
            title = '" . base64_decode($data->title) . "',
            manager_id = '" . $data->manager_id . "',
            user_created_id = '" . $data->user_created_id . "',
            date_modified = '" . strtotime(date('Y-m-d H:i:s')) . "',
            state = '1'
            WHERE id = '" . $data->id . "'");
        } else {
          $result = q("INSERT INTO projects (
              title,
              manager_id,
              user_created_id,
              date_created,
              state
            ) VALUES (
              '" . base64_decode($data->title) . "',
              '" . $data->manager_id . "',
              '" . $data->user_created_id . "',
              '" . strtotime(date('Y-m-d H:i:s')) . "',
              '1'
            )");
        }
        break;

      case 'feature':
        if ($data->id > 0) {
          $result = q("UPDATE features SET
            title = '" . base64_decode($data->title) . "',
            project_id = '" . $data->project_id . "',
            user_created_id = '" . $data->user_created_id . "',
            date_modified = '" . strtotime(date('Y-m-d H:i:s')) . "',
            state = '1'
            WHERE id = '" . $data->id . "'");
        } else {
          $result = q("INSERT INTO features (
              title,
              project_id,
              user_created_id,
              date_created,
              state
            ) VALUES (
              '" . base64_decode($data->title) . "',
              '" . $data->project_id . "',
              '" . $data->user_created_id . "',
              '" . strtotime(date('Y-m-d H:i:s')) . "',
              '1'
            )");
        }
        break;

      case 'sprint':
        if ($data->id > 0) {
          $result = q("UPDATE sprints SET
            title = '" . base64_decode($data->title) . "',
            team = '" . $data->team . "',
            user_created_id = '" . $data->user_created_id . "',
            date_start = '" . $data->date_start . "',
            date_end = '" . $data->date_end . "',
            date_modified = '" . strtotime(date('Y-m-d H:i:s')) . "',
            state = '1'
            WHERE id = '" . $data->id . "'");

          q("DELETE FROM sprint_tasks WHERE sprint_id = " . $data->id);
          $sprint_id = $data->id;
        } else {
          $result = q("INSERT INTO sprints (
              title,
              team,
              user_created_id,
              date_start,
              date_end,
              date_created,
              state
            ) VALUES (
              '" . base64_decode($data->title) . "',
              '" . $data->team . "',
              '" . $data->user_created_id . "',
              '" . $data->date_start . "',
              '" . $data->date_end . "',
              '" . strtotime(date('Y-m-d H:i:s')) . "',
              '1'
            )");

          $sprint_id = $result;
        }

        $insert = "INSERT INTO sprint_tasks (sprint_id, task_id) VALUES ";
        $insert_rows = [];
        foreach ($data->sprint_tasks as $key => $value) {
          array_push($insert_rows, "('" . $sprint_id . "', '" . $value . "')");
        }
        q($insert . implode(', ', $insert_rows));
        break;

      case 'task':
        if ($data->id > 0) {
          $result = q("UPDATE tasks SET
            title = '" . base64_decode($data->title) . "',
            feature_id = '" . $data->feature_id . "',
            user_created_id = '" . $data->user_created_id . "',
            date_modified = '" . strtotime(date('Y-m-d H:i:s')) . "',
            state = '1',
            time_plan = '" . $data->time_plan . "',
            time_fact = '" . $data->time_fact . "'
            WHERE id = '" . $data->id . "'");

          q("DELETE FROM task_users WHERE task_id = " . $data->id);
          $task_id = $data->id;

        } else {
          $result = q("INSERT INTO tasks (
              title,
              feature_id,
              user_created_id,
              date_created,
              state,
              time_plan,
              time_fact
            ) VALUES (
              '" . base64_decode($data->title) . "',
              '" . $data->feature_id . "',
              '" . $data->user_created_id . "',
              '" . strtotime(date('Y-m-d H:i:s')) . "',
              '1',
              '" . $data->time_plan . "',
              '" . $data->time_fact . "'
            )");

          $task_id = $result;
        }

        $insert = "INSERT INTO task_users (task_id, user_id) VALUES ";
        $insert_rows = [];
        foreach ($data->task_users as $key => $value) {
          array_push($insert_rows, "('" . $task_id . "', '" . $value . "')");
        }
        q($insert . implode(', ', $insert_rows));
        break;
    }
    break;

  case 'get':
    $data = json_decode(base64_decode($_REQUEST['data']));
    $rows = array();
    switch ($act2) {

      case 'projects':
        $result = q("SELECT * FROM projects ORDER BY title ASC " . ($data->start > -1 ? "LIMIT " . $data->start . ", 20" : "") . "");
        while ($row = $result->fetch_assoc()) {
          array_push($rows, array(
              'id' => $row['id'],
              'title' => $row['title'],
              'state' => $row['state'],
              'manager_id' => $row['manager_id'],
              'user_created_id' => $row['user_created_id'],
              'date_created' => date('d.m.Y', $row['date_created'])
            )
          );
        }
        break;

      case 'features':
        $result = q("SELECT * FROM features ORDER BY title ASC " . ($data->start > -1 ? "LIMIT " . $data->start . ", 20" : "") . "");
        while ($row = $result->fetch_assoc()) {
          array_push($rows, array(
              'id' => $row['id'],
              'title' => $row['title'],
              'state' => $row['state'],
              'project_id' => $row['project_id'],
              'user_created_id' => $row['user_created_id'],
              'date_created' => date('d.m.Y', $row['date_created'])
            )
          );
        }
        break;

      case 'teams':
        $result = q("SELECT * FROM teams ORDER BY id ASC " . ($data->start > -1 ? "LIMIT " . $data->start . ", 20" : "") . "");
        while ($row = $result->fetch_assoc()) {
          array_push($rows, array(
              'id' => $row['id'],
              'title' => $row['title']
            )
          );
        }
        break;

      case 'sprints':
        $result = q("SELECT * FROM sprints ORDER BY date_start ASC " . ($data->start > -1 ? "LIMIT " . $data->start . ", 20" : "") . "");
        while ($row = $result->fetch_assoc()) {
          array_push($rows, array(
              'id' => $row['id'],
              'title' => $row['title'],
              'state' => $row['state'],
              'team' => $row['team'],
              'date_start' => $row['date_start'],
              'date_end' => $row['date_end'],
              'user_created_id' => $row['user_created_id'],
              'date_created' => date('d.m.Y', $row['date_created'])
            )
          );
        }
        break;

      case 'tasks':
        $result = q("SELECT * FROM tasks ORDER BY title ASC " . ($data->start > -1 ? "LIMIT " . $data->start . ", 20" : "") . "");
        while ($row = $result->fetch_assoc()) {
          array_push($rows, array(
              'id' => $row['id'],
              'title' => $row['title'],
              'state' => $row['state'],
              'feature_id' => $row['feature_id'],
              'user_created_id' => $row['user_created_id'],
              'time_plan' => $row['time_plan'],
              'time_fact' => $row['time_fact'],
              'date_created' => date('d.m.Y', $row['date_created'])
            )
          );
        }
        break;

      case 'tasksfree':
        $result = q("SELECT t.*
          FROM tasks AS t
          LEFT JOIN sprint_tasks AS st ON st.task_id = t.id
          WHERE st.id IS NULL
          ORDER BY t.title ASC
          " . ($data->start > -1 ? "LIMIT " . $data->start . ", 20" : "") . "");

        while ($row = $result->fetch_assoc()) {
          array_push($rows, array(
              'id' => $row['id'],
              'title' => $row['title'],
              'state' => $row['state'],
              'feature_id' => $row['feature_id'],
              'user_created_id' => $row['user_created_id'],
              'time_plan' => $row['time_plan'],
              'time_fact' => $row['time_fact'],
              'date_created' => date('d.m.Y', $row['date_created'])
            )
          );
        }
        break;

      case 'features_projects':
        $result = q("SELECT f.*, p.title AS project_title
          FROM features AS f
          LEFT JOIN projects AS p ON p.id = f.project_id
          ORDER BY p.title ASC, f.title ASC");

        // $rowsTmp = array();
        while ($row = $result->fetch_assoc()) {
          $project = $row['project_title'] . '_' . $row['project_id'];
          if (!is_array($rows[$project])) {
            $rows[$project] = array();
          }
          array_push($rows[$project], array(
              'id' => $row['id'],
              'title' => $row['title'],
              'project_title' => $row['project_title'],
              'project_id' => $row['project_id'],
              'state' => $row['state'],
              'user_created_id' => $row['user_created_id'],
              'date_created' => date('d.m.Y', $row['date_created'])
            )
          );
        }

        // foreach ($rowsTmp as $key => $value) {
        //   if (!is_array($rows[$value['project_id']])) {
        //     $rows[$value['project_id']] = array();
        //   }
        //   $rows[$value['project_id']][]
        // }
        break;

      case 'states':
        switch ($act3) {

          case 'tasks':
            $result = q("SELECT * FROM states_tasks ORDER BY id ASC");
            while ($row = $result->fetch_assoc()) {
              array_push($rows, array(
                  'id' => $row['id'],
                  'title' => $row['title']
                )
              );
            }
            break;

          case 'users':
            $result = q("SELECT * FROM states_users ORDER BY id ASC");
            while ($row = $result->fetch_assoc()) {
              array_push($rows, array(
                  'id' => $row['id'],
                  'title' => $row['title']
                )
              );
            }
            break;
        }
        break;

      case 'users':
        switch ($act3) {

          case 'dev':
            $result = q("SELECT * FROM users WHERE team = 3 OR team = 4 ORDER BY name ASC");
            while ($row = $result->fetch_assoc()) {
              array_push($rows, array(
                  'id' => $row['id'],
                  'name' => $row['name']
                )
              );
            }
            break;

          case 'qa':
            $result = q("SELECT * FROM users WHERE team = 5 ORDER BY name ASC");
            while ($row = $result->fetch_assoc()) {
              array_push($rows, array(
                  'id' => $row['id'],
                  'name' => $row['name']
                )
              );
            }
            break;

          case 'task':
            $result = q("SELECT * FROM task_users ORDER BY id ASC");
            while ($row = $result->fetch_assoc()) {
              array_push($rows, array(
                  'id' => $row['id'],
                  'name' => $row['name']
                )
              );
            }
            break;
        }
        break;
    }
    echo json_encode($rows);
    break;

  // case 'runLogin':
  //   $session_id = GUI(40);
  //   $start = rand(1, 24);
  //   $end = 24 - $start;
  //   $start = GUI($start);
  //   $end = GUI($end);
  //   $data = json_decode(base64_decode($_REQUEST['data']));

  //   $result = q("SELECT id, email FROM users WHERE email = '" . $data->email . "' AND password = '" . $data->password . "'");

  //   if ($result->num_rows === 1) {
  //     $user = $result->fetch_assoc();
  //     $result = q("INSERT INTO sessions (
  //         code,
  //         code_start,
  //         code_end,
  //         os,
  //         browser,
  //         ip,
  //         ip2,
  //         ip3,
  //         datecreated,
  //         user
  //       ) VALUES (
  //         '" . $session_id . "',
  //         '" . $start . "',
  //         '" . $end . "',
  //         '" . php_uname('a') . "',
  //         '" . $_SERVER['HTTP_USER_AGENT'] . "',
  //         '" . $_SERVER['REMOTE_ADDR'] . "',
  //         '" . $_SERVER['HTTP_X_FORWARDED_FOR'] . "',
  //         '" . $_SERVER['HTTP_CLIENT_IP'] . "',
  //         '" . date('Y-m-d H:i:s') . "',
  //         '" . $user['id'] . "'
  //       )");

  //     // echo json_encode([$result, 123, $data, $mysqli->insert_id]);
  //     echo json_encode(['code' => $start . $session_id . $end, 'user' => $user->email]);
  //   } else {
  //     echo json_encode(['error' => 'Error']);
  //   }



  //   break;

  // case 'runSignup':
  //   $data = json_decode(base64_decode($_REQUEST['data']));
  //   $result = q("INSERT INTO users (email) VALUES ('" . $data->title . "')");

  //   echo json_encode([$result, 123, $data, $mysqli->insert_id]);
  //   break;

  // case 'getCategories':
  //   $result = q("SELECT * FROM categories WHERE state = 1 ORDER BY title ASC");
  //   $rows = array();
  //   while ($row = $result->fetch_assoc()) {
  //     array_push($rows, array(
  //         'id' => $row['id'],
  //         'title' => $row['title'],
  //         'state' => $row['state'],
  //         'url' => $row['url'],
  //         'subid' => $row['subid']
  //       )
  //     );
  //   }
  //   echo json_encode($rows);
  //   break;

  // case 'getArticles':
  //   $result = q("SELECT c.* FROM categories AS c WHERE c.url = '" . $_GET['category_url'] . "'");
  //   $category = $result->fetch_assoc();

  //   if ($category['id'] > 0) {
  //     $result = q("SELECT a.* FROM articles AS a
  //       WHERE a.category = '" . $category['id'] . "' AND a.state = 1
  //       ORDER BY a.datecreated DESC");

  //     $articles = array();
  //     while ($article = $result->fetch_assoc()) {
  //       array_push($articles, array(
  //           'id' => $article['id'],
  //           'title' => $article['title'],
  //           'state' => $article['state'],
  //           'url' => $article['url'],
  //           'category_url' => $category['url'],
  //           'date' => date('d.m.Y', $article['datecreated']),
  //           'time' => date('H:i', $article['datecreated']),
  //           'subid' => $article['subid']
  //         )
  //       );
  //     }
  //     echo json_encode(['category' => $category, 'articles' => $articles]);
  //   } else {
  //     echo json_encode(['error' => 'Not_found']);
  //   }
  //   break;

  // case 'getArticlesHome':
  //   $result = q("SELECT a.*, c.title AS category_name, c.url AS category_url FROM articles AS a
  //     INNER JOIN categories AS c ON c.id = a.category
  //     WHERE a.state = 1
  //     ORDER BY a.datecreated DESC
  //     LIMIT 10");
  //   // $result = q("SELECT a.* FROM articles AS a WHERE a.category = 2 ORDER BY a.datecreated DESC");

  //   $rows = array();
  //   while ($row = $result->fetch_assoc()) {
  //     array_push($rows, array(
  //         'id' => $row['id'],
  //         'title' => $row['title'],
  //         'state' => $row['state'],
  //         'url' => $row['url'],
  //         'category_url' => $row['category_url'],
  //         'date' => date('d.m.Y', $row['datecreated']),
  //         'time' => date('H:i', $row['datecreated']),
  //         'subid' => $row['subid']
  //       )
  //     );
  //   }
  //   echo json_encode($rows);
  //   break;

  // case 'getArticlesAdmin':
  //   $result = q("SELECT a.*, c.title AS category_name, c.url AS category_url FROM articles AS a
  //     INNER JOIN categories AS c ON c.id = a.category
  //     ORDER BY a.datecreated DESC
  //     LIMIT 10");
  //   // $result = q("SELECT a.* FROM articles AS a WHERE a.category = 2 ORDER BY a.datecreated DESC");

  //   $rows = array();
  //   while ($row = $result->fetch_assoc()) {
  //     array_push($rows, array(
  //         'id' => $row['id'],
  //         'title' => $row['title'],
  //         'state' => $row['state'],
  //         'url' => $row['url'],
  //         'category_url' => $row['category_url'],
  //         'category_name' => $row['category_name'],
  //         'date' => date('d.m.Y', $row['datecreated']),
  //         'time' => date('H:i', $row['datecreated']),
  //         'subid' => $row['subid'],
  //         'cost' => $row['cost'],
  //         'paid' => $row['paid']
  //       )
  //     );
  //   }
  //   echo json_encode($rows);
  //   break;

  // case 'getArticle':
  //   $result = q("SELECT a.* FROM categories AS c
  //     INNER JOIN articles AS a ON a.category = c.id
  //     WHERE c.url = '" . $_GET['category'] . "' AND a.url = '" . $_GET['article'] . "'
  //     ORDER BY a.datecreated DESC");
  //   // $result = q("SELECT a.* FROM articles AS a WHERE a.category = 2 ORDER BY a.datecreated DESC");

  //   $rows = array();
  //   while ($row = $result->fetch_assoc()) {
  //     array_push($rows, array(
  //         'id' => $row['id'],
  //         'title' => $row['title'],
  //         'state' => $row['state'],
  //         'url' => $row['url'],
  //         'content' => $row['content']
  //       )
  //     );
  //   }
  //   echo json_encode($rows[0]);
  //   break;

  // case 'addArticle':


  //   if (isset($_REQUEST['part'])) {
  //     if (!isset($_SESSION['data'])) {
  //       $_SESSION['data'] = '';
  //     }
  //     $_SESSION['data'] .= $_REQUEST['part'];
  //   } else {
  //     if (isset($_REQUEST['finish'])) {
  //       $data = json_decode(base64_decode($_SESSION['data'] . $_REQUEST['finish']));
  //       $finish = true;
  //       $_SESSION['data'] = '';
  //     } else {
  //       $finish = false;
  //       $data = json_decode(base64_decode($_REQUEST['data']));
  //     }

  //     $url = strtolower(str_replace(' ', '-', preg_replace('!\s+!', ' ', preg_replace("/[^a-zA-Z0-9 ]+/", "", JTransliteration::transliterate(base64_decode($data->title))))));
  //     // echo $url;
  //     // exit();

  //     if ($data->id > 0) {
  //       $result = q("UPDATE articles SET
  //         title = '" . base64_decode($data->title) . "',
  //         content = '" . base64_decode($data->content) . "',
  //         category = '" . $data->category . "',
  //         datemodified = '" . strtotime(date('Y-m-d H:i:s')) . "',
  //         state = '" . $data->state . "'
  //         WHERE id = '" . $data->id . "'");
  //     } else {
  //       $result = q("INSERT INTO articles (
  //         title,
  //         content,
  //         category,
  //         url,
  //         datecreated,
  //         state
  //         ) VALUES (
  //         '" . base64_decode($data->title) . "',
  //         '" . base64_decode($data->content) . "',
  //         '" . $data->category . "',
  //         '" . $url . "',
  //         '" . strtotime(date('Y-m-d H:i:s')) . "',
  //         '" . $data->state . "'
  //         )");
  //     }




  //     // $rows = array();
  //     // while ($row = $result->fetch_assoc()) {
  //     //   array_push($rows, array(
  //     //       'id' => $row['id'],
  //     //       'title' => $row['title'],
  //     //       'state' => $row['state'],
  //     //       'url' => $row['url'],
  //     //       'subid' => $row['subid']
  //     //     )
  //     //   );
  //     // }
  //     echo json_encode([$result, $finish, $data, $mysqli->insert_id, $url, $_SESSION['data'], $_REQUEST['finish']]);
  //   }
  //   break;

  // case 'delete':
  //   switch ($_REQUEST['type']) {
  //     case 'article':
  //       $result = q("DELETE FROM articles WHERE id = '" . $_REQUEST['id'] . "'");
  //       echo json_encode($result);
  //       break;

  //     case 'category':
  //       $result = q("DELETE FROM categories WHERE id = '" . $_REQUEST['id'] . "'");
  //       echo json_encode($result);
  //       break;

  //     case 'user':
  //       $result = q("DELETE FROM users WHERE id = '" . $_REQUEST['id'] . "'");
  //       echo json_encode($result);
  //       break;
  //   }
  //   break;

  // case 'edit':
  //   switch ($_REQUEST['type']) {
  //     case 'article':
  //       $result = q("SELECT a.* FROM articles AS a
  //         WHERE a.id = '" . $_REQUEST['id'] . "'");
  //       // $result = q("SELECT a.* FROM articles AS a WHERE a.category = 2 ORDER BY a.datecreated DESC");

  //       $rows = array();
  //       while ($row = $result->fetch_assoc()) {
  //         array_push($rows, array(
  //             'id' => $row['id'],
  //             'title' => base64_encode($row['title']),
  //             'state' => $row['state'],
  //             'url' => $row['url'],
  //             'category' => $row['category'],
  //             'content' => base64_encode($row['content'])
  //           )
  //         );
  //       }
  //       echo json_encode($rows[0]);
  //       break;

  //     // case 'category':
  //     //   $result = q("DELETE FROM categories WHERE id = '" . $_REQUEST['id'] . "'");
  //     //   echo json_encode($result);
  //     //   break;

  //     // case 'user':
  //     //   $result = q("DELETE FROM users WHERE id = '" . $_REQUEST['id'] . "'");
  //     //   echo json_encode($result);
  //     //   break;
  //   }
  //   break;

  // case 'addUser':
  //   $data = json_decode(base64_decode($_REQUEST['data']));
  //   $code = crypt($data->email . strtotime(date('Y-m-d H:i:s')) . 'code', $data->password);
  //   $refresh = crypt($code, $data->password);
  //   $result = q("INSERT INTO users (
  //     code,
  //     refresh,
  //     datecreated,
  //     email,
  //     password
  //     ) VALUES (
  //     '" . $code . "',
  //     '" . $refresh . "',
  //     '" . date('Y-m-d H:i:s') . "',
  //     '" . $data->email . "',
  //     '" . crypt($data->password, $data->password) . "'
  //     )");

  //   // $rows = array();
  //   // while ($row = $result->fetch_assoc()) {
  //   //   array_push($rows, array(
  //   //       'id' => $row['id'],
  //   //       'title' => $row['title'],
  //   //       'state' => $row['state'],
  //   //       'url' => $row['url'],
  //   //       'subid' => $row['subid']
  //   //     )
  //   //   );
  //   // }
  //   echo json_encode($code . '/' . $refresh);
  //   break;

  // case 'getUser':
  //   $data = json_decode(base64_decode($_REQUEST['data']));
  //   $result = q("SELECT * FROM articles WHERE state = 1 ORDER BY datecreated DESC");
  //   $rows = array();
  //   while ($row = $result->fetch_assoc()) {
  //     array_push($rows, array(
  //         'id' => $row['id'],
  //         'title' => $row['title'],
  //         'state' => $row['state'],
  //         'content' => $row['content'],
  //         'category' => $row['category'],
  //         'datecreated' => date('H:i d.m.y', strtotime($row['datecreated']))
  //       )
  //     );
  //   }
  //   echo json_encode($rows);
  //   break;

  default:
    $request = key($_REQUEST);
    $request = explode('/', $request);
    echo json_encode([$request, 321]);
    break;
}


?>