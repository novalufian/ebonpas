<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_detail_bon extends CI_Model {

	public function simpan($data)
		{
			$this->db->insert('bon_detail', $data);
			return true;
		}	

	public function get_by_bon_id($id)
	{
		$this->db->select('*');
		$this->db->where('bon_id', $id);
		$this->db->join('data_napi', 'data_napi.napi_id = bon_detail.napi_id', 'left');
		$this->db->join('master_kamar', 'data_napi.napi_kamar = master_kamar.master_kamar_id', 'left');
			$this->db->join('master_blok', 'master_kamar.master_blok_id = master_blok.blok_master_id', 'left');
		$q = $this->db->get('bon_detail');
		return $q->result_array();
	}

}

/* End of file Modell_detail_bon.php */
/* Location: ./application/models/Modell_detail_bon.php */