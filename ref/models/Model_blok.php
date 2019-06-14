<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Model_blok extends CI_Model {

    public function get_all_published()
        {
            $this->db->select('*');
            $this->db->where('blok_published', true);
            $q = $this->db->get('master_blok');
            return $q->result_array();
        }    

}

/* End of file Model_blok.php */
/* Location: ./application/models/Model_blok.php */