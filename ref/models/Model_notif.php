<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_notif extends CI_Model {

	public function save($data)
	{
		$this->db->insert('notif', $data);
		return true;
	}	
	public function get_all_unread_admin($role)
	{
		$this->db->where('notif_user_role', $role);
		$this->db->where('notif_status', true);
		$q = $this->db->get('notif');
		return $q->result_array();
	}

	public function get_all_unread_by_user($id, $role)
	{
		$this->db->where('notif_user_destiny', $id);
		$this->db->where('notif_user_role', $role);
		$this->db->where('notif_status', true);
		$this->db->join('data_pegawai', 'data_pegawai.user_id = notif.notif_user_id', 'left');
		$q = $this->db->get('notif');
		return $q->result_array();
	}

	public function get_all_read_by_user($id, $role)
	{
		$this->db->where('notif_user_destiny', $id);
		$this->db->where('notif_user_role', $role);
		$this->db->where('notif_status', false);
		$this->db->join('data_pegawai', 'data_pegawai.user_id = notif.notif_user_id', 'left');
		$q = $this->db->get('notif',5);
		return $q->result_array();
	}

	public function update_notif_to_read_state($user,$role)
	{
		$this->db->where('notif_user_destiny', $user);
		$this->db->where('notif_user_role', $role);
		$this->db->update('notif', array("notif_status"=>false));
	}


}

/* End of file Model_notif.php */
/* Location: ./application/models/Model_notif.php */