<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_pegawai extends CI_Model {

	public function get_published()
		{
			$this->db->select('*');
			$this->db->where('pegawai_published', true);
			$this->db->join('master_subagian', 'data_pegawai.subag_pegawai = master_subagian.subagian_id', 'left');
			$this->db->from('data_pegawai');
			$q = $this->db->get();
			return $q->result_array();

		}	
	public function get_one_pegawai_published($id)
		{
			$this->db->select('*');
			$this->db->where('user_id', $id);
			$this->db->where('pegawai_published', true);
			$this->db->join('master_subagian', 'master_subagian.subagian_id = data_pegawai.subag_pegawai', 'left');
			$q = $this->db->get('data_pegawai');
			return $q->result_array();

		}	

	public function simpan_data($data)
	{
		$this->db->insert('data_pegawai', $data);
		return true;
	}

	public function update_data($id, $data)
	{
		$this->db->where('user_id', $id);
		$this->db->update('data_pegawai', $data);
		return true;
	}

	public function unpublish_data($id)
	{
		$object = array('pegawai_published' => false);
		$this->db->where('user_id', $id);
		$this->db->update('data_pegawai', $object);
		return true;
	}

}

/* End of file Model_pegawai.php */
/* Location: ./application/models/Model_pegawai.php */