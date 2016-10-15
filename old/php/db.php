<?php

function q($query) {
  // $mysqli = new mysqli('datsko.mysql.ukraine.com.ua', 'datsko_todaynews', 'rvbef8vy', 'datsko_todaynews');
  $mysqli = new mysqli('datsko.mysql.ukraine.com.ua', 'datsko_behawk', 'vayhxxrw', 'datsko_behawk');

  if ($mysqli->connect_errno) {
    throw new Exception("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
  }

  if (!$mysqli->set_charset("utf8")) {
    throw new Exception("Error loading character set utf8: %s\n", $mysqli->error);
    exit();
  } else {
    // printf("Current character set: %s\n", $mysqli->character_set_name());
  }
  // echo $query;
  $result = $mysqli->query($query);
  if (!$result) {
    echo $query;
    throw new Exception("Database Error [{$mysqli->errno}] {$mysqli->error}, (query: $query)");
  } else {
    return substr($query, 0, 6) == "INSERT" ? $mysqli->insert_id : $result;
  }
  $mysqli->close();
}
?>