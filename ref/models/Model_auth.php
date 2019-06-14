<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_auth extends CI_Model {

	public function get_all_published_by_type($type)
		{
			$this->db->select('*');
			$this->db->where('user_login_role', $type);
			$this->db->where('published', true);
			$this->db->join('data_pegawai', 'data_pegawai.user_id = login.user_id', 'left');
			$q = $this->db->get('login');
			return $q->result_array();
		}

	public function get_all_published_by_type_one($type, $id)
		{
			$this->db->select('*');
			$this->db->where('login_id', $id);
			$this->db->where('user_login_role', $type);
			$this->db->where('published', true);
			$this->db->join('data_pegawai', 'data_pegawai.user_id = login.user_id', 'left');
			$q = $this->db->get('login');
			return $q->result_array();
		}	

	public function delete_user($id)
	{
		$object = array('published' => false, );
		$this->db->where('login_id', $id);
		$this->db->update('login', $object);
		return true;
	}

	public function simpan($data)
	{
		$this->db->insert('login', $data);
		return true;
	}

	public function update_password_uname($id, $object)
	{
		$this->db->where('login_id', $id);
		$this->db->update('login', $object);
		return true;
	}

}

/* End of file Model_auth.php */
/* Location: ./application/models/Model_auth.php */