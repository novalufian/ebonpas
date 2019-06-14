<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {

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

	public function index()
	{
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/home');
		$this->load->view('admin/partial/footer');
	}

}

/* End of file Home.php */
/* Location: ./application/controllers/admin/Home.php */