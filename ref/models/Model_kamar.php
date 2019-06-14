<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_kamar extends CI_Model {

	public function get_all_published()
	{
		$this->db->select('*');
		$this->db->from('master_kamar');
		$this->db->where('master_kamar.kamar_published', true);
		$this->db->join('master_blok', ' master_blok.blok_master_id =master_kamar.master_blok_id', 'inner');
		$q = $this->db->get();
		return $q->result_array();
	}	

	public function get_one_published($id)
	{
		$this->db->select('*');
		$this->db->from('master_kamar');
		$this->db->where('master_kamar_id', $id);
		$this->db->where('kamar_published', true);
		$q = $this->db->get();
		return $q->result_array();
	}

	public function get_by_blok($blok)
	{
		$this->db->select('*');
		$this->db->from('master_kamar');
		$this->db->where('kamar_published', true);
		$this->db->where('master_blok_id', $blok);
		$q = $this->db->get();
		return $q->result_array();
	}

	public function simpan($data)
	{
		$this->db->insert('master_kamar', $data);
		return true;
	}

	public function update($id, $data)
	{
		$this->db->where('master_kamar_id', $id);
		$this->db->update('master_kamar', $data);
		return true;
	}
}

/* End of file Model_kamar.php */
/* Location: ./application/models/Model_kamar.php */