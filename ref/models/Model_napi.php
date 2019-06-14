<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_napi extends CI_Model {

	public function get_all_published()
		{
			$this->db->select('*');
			$this->db->where('napi_published', true);
			$this->db->join('master_kamar', 'data_napi.napi_kamar = master_kamar.master_kamar_id', 'left');
			$this->db->join('master_blok', 'master_kamar.master_blok_id = master_blok.blok_master_id', 'left');
			$this->db->join('master_subagian', 'data_napi.napi_booked_by = master_subagian.subagian_id', 'left');
			$q = $this->db->get('data_napi');
			return $q->result_array();
		}	

	public function napi_unpublished($id)
	{
		$object = array('napi_published' => false);
		$this->db->where('napi_id', $id);
		$this->db->update('data_napi', $object);
		return true;
	}

	public function get_by_kamarid($id)
	{
		$this->db->select('*');
		$this->db->where('napi_published', true);
		$this->db->where('napi_kamar', $id);
		$this->db->join('master_kamar', 'data_napi.napi_kamar = master_kamar.master_kamar_id', 'left');
		$this->db->join('master_blok', 'master_kamar.master_blok_id = master_blok.blok_master_id', 'left');
		$this->db->join('master_subagian', 'data_napi.napi_booked_by = master_subagian.subagian_id', 'left');
		$q = $this->db->get('data_napi');
		return $q->result_array();
	}

	public function napi_simpan($data)
	{
		$this->db->insert('data_napi', $data);
		return true;
	}

	public function napi_update($id, $data)
	{
		$this->db->where('napi_id', $id);
		$this->db->update('data_napi', $data);
		return true;
	}

	public function get_one_napi($id)
	{
		$this->db->select('*');
		$this->db->from('data_napi');
		$this->db->where('napi_id', $id);
		$this->db->where('napi_published', true);
		$this->db->join('master_kamar', 'data_napi.napi_kamar = master_kamar.master_kamar_id', 'left');
		$q = $this->db->get();
		return $q->result_array();
	}
	// counting
	public function count_all_napi($kamar)
	{
		$this->db->select('*');
		if ($kamar !== null) {
			$this->db->where('napi_kamar', $kamar);
		}
		$this->db->where('napi_published', true);
		$q = $this->db->get('data_napi');
		return count($q->result_array());
	}

	public function count_all_napi_by_subag($kamar, $subag)
	{
		$this->db->select('*');
		if ($kamar !== null) {
			$this->db->where('napi_kamar', $kamar);
		}
		$this->db->where('napi_booked_by', $subag);
		$this->db->where('napi_published', true);
		$q = $this->db->get('data_napi');
		return count($q->result_array());
	}

	public function count_all_napi_unbooked($kamar)
	{
		$this->db->select('*');
		if ($kamar !== null) {
			$this->db->where('napi_kamar', $kamar);
		}
		$this->db->where('napi_published', true);
		$this->db->where('napi_booked', false);
		$q = $this->db->get('data_napi');
		return count($q->result_array());
	}

}

/* End of file Model_napi.php */
/* Location: ./application/models/Model_napi.php */