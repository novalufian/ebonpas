<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {
	public function __construct()
	{
		parent::__construct();
		$data = $this->session->userdata('admin_ebonpas');
		if ($data !== null) {
			if ($data['role'] == 1) {
				redirect('/admin/home');
			}
		}
	}

	public function index()
	{
		$this->load->view('admin/login');
	}

	public function login()
	{
		$credential = array(
			'username' => $this->input->post('username'), 
			'password' => $this->input->post('password'), 
			'role' => 1, 
		);

		$res = $this->Model_auth_admin->login($credential);
		if (empty($res)) {
			redirect('/admin/auth/');
		}else{
			$data = array(
				'login_id' => $res[0]['login_id'],
				'current_user_id' => $res[0]['user_id'],
				'role' => 1,
			);

			$this->session->set_userdata(array('admin_ebonpas'=>$data));
			// $this->input->set_cookie('login_ebonpas', json_encode($data), 3600 * 72, 'localhost', '/', true);
			redirect('/admin/home');

		}
	}

	public function logout()
	{
		// echo get_cookie('1login_ebonpas');
		session_destroy();
		// $this->input->set_cookie('login_ebonpas', "", 1, 'localhost', '/', true);
		redirect('admin/auth');
	}

}

/* End of file Login.php */
/* Location: ./application/controllers/admin/Login.php */