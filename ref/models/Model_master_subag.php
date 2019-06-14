<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_master_subag extends CI_Model {

	public function get_all_published()
		{
			$this->db->select('*');
			$q = $this->db->get('master_subagian');
			return $q->result_array();
		}	

}

/* End of file Model_master_subag.php */
/* Location: ./application/models/Model_master_subag.php */