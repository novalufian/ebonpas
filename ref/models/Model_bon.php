<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_bon extends CI_Model {

	public function simpan($data)
	{
		$this->db->insert('bon', $data);
		return true;
	}

	public function get_all_data()
	{
		$this->db->select('*');
		$this->db->join('data_pegawai', 'data_pegawai.user_id = bon.bon_user', 'left');
		$this->db->join('master_subagian', 'master_subagian.subagian_id = bon.bon_subagian', 'left');
		$q = $this->db->get('bon');
		return $q->result_array();
	}

	public function get_all_data_by_user($id)
	{
		$this->db->select('*');
		$this->db->where('bon_user', $id);
		$this->db->join('data_pegawai', 'data_pegawai.user_id = bon.bon_user', 'left');
		$this->db->join('master_subagian', 'master_subagian.subagian_id = bon.bon_subagian', 'left');
		$q = $this->db->get('bon');
		return $q->result_array();
	}

	public function get_all_by_subagian()
	{
		# code...
	}

	public function get_by_id($id)
	{
		$this->db->select('*');
		$this->db->where('bon_id', $id);
		$this->db->join('data_pegawai', 'data_pegawai.user_id = bon.bon_user', 'left');
		$this->db->join('master_subagian', 'master_subagian.subagian_id = bon.bon_subagian', 'left');
		$q = $this->db->get('bon');
		return $q->result_array();
	}

	public function update($id, $data)
	{
		$this->db->where('bon_id', $id);
		$this->db->update('bon', $data);
		return true;
	}
	

}

/* End of file Model_bon.php */
/* Location: ./application/models/Model_bon.php */