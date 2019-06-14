<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {
	public function __construct()
	{
		parent::__construct();
		$data = $this->session->userdata('client_ebonpas');
		if ($data !== null) {
			if ($data['role'] == 0) {
				redirect('/home');
			}
		}
	}

	public function index()
	{
		$this->load->view('client/login');
	}

	public function login()
	{
		$credential = array(
			'username' => $this->input->post('username'), 
			'password' => $this->input->post('password'), 
			'role' => 0, 
		);

		$res = $this->Model_auth_admin->login($credential);
		if (empty($res)) {
			redirect('/auth/');
		}else{
			$data = array(
				'login_id' => $res[0]['login_id'],
				'current_user_id' => $res[0]['user_id'],
				'role' => 0,
			);
			$this->session->set_userdata(array('client_ebonpas'=>$data));
			// $this->input->set_cookie('login_ebonpas_client', json_encode($data), 3600 * 72, 'localhost', '/', true);
			redirect('/home');

		}
	}

	public function logout()
	{
		session_destroy();
		redirect('/auth');
	}


}

/* End of file Login.php */
/* Location: ./application/controllers/client/Login.php */