<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_auth_admin extends CI_Model {

	public function login($data)
	{
		// echo var_dump($data);
		$this->db->select('*');
		$this->db->where('username', $data['username']);
		$this->db->where('password', $data['password']);
		$this->db->where('user_login_role', $data['role']);
		$this->db->from('login');
		$this->db->limit(1);
		$q = $this->db->get();
		return $q->result_array();
	}

}

/* End of file Auth-admin.php */
/* Location: ./application/models/Auth-admin.php */