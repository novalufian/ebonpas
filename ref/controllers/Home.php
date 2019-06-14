<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {
	public function __construct()
	{
		parent::__construct();
		$data = $this->session->userdata('client_ebonpas');
		if ($data == null) {
			redirect('/auth');
		}else if ($data['role'] !== 0) {
			redirect('/auth');
		}
	}

	public function index()
	{
		$this->load->view('client/partial/header');		
		$this->load->view('client/page/home');		
		$this->load->view('client/partial/footer');		
	}

}

/* End of file Home.php */
/* Location: ./application/controllers/Home.php */