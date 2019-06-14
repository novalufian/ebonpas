<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Get_json extends CI_Controller {
	public function __construct()
	{
		parent::__construct();
		$data = $this->session->userdata('admin_ebonpas');
		if ($data == null) {
			redirect('/admin/auth');
		}else if ($data['role'] !== 1) {
			redirect('/admin/auth');
		}
	}
	
	public function get_kamar_json()
	{
		$blok = $this->uri->segment(4);
		$q =$this->Model_kamar->get_by_blok($blok);
		echo json_encode($q);
	}

}

/* End of file Get_json.php */
/* Location: ./application/controllers/admin/Get_json.php */