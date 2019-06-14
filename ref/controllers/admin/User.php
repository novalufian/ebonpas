'<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller {
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
		$this->load->view('admin/page/user');
		$this->load->view('admin/partial/footer');
	}

	public function admin()
	{
		$data['admin_list'] = $this->get_published_user(1);
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/user-admin', $data);
		$this->load->view('admin/partial/footer');
	}

	public function tambah_admin()
	{
		$data['list_pegawai'] = $this->get_published_pegawai();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/admin-tambah', $data);
		$this->load->view('admin/partial/footer');
	}

	public function tambah_client()
	{
		$data['list_pegawai'] = $this->get_published_pegawai();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/client-tambah', $data);
		$this->load->view('admin/partial/footer');
	}

	public function edit()
	{
		if ($this->uri->segment(5) == "admin") {
			$role = 1;
		}else{
			$role = 0;
		}
		$data['pegawai'] = $this->Model_auth->get_all_published_by_type_one($role, $this->uri->segment(4));
		// echo json_encode($data);
		// die();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/admin-edit', $data);
		$this->load->view('admin/partial/footer');
	}

	public function client()
	{
		$data['client_list'] = $this->get_published_user(0);
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/user-client', $data);
		$this->load->view('admin/partial/footer');
	}

	public function get_published_user($type)
	{
		$q = $this->Model_auth->get_all_published_by_type($type);
		return $q;
	}

	public function delete()
	{
		$id = $this->uri->segment(4);
		$surce = $this->uri->segment(5);
		$this->Model_auth->delete_user($id);
		redirect('/admin/user/'.$surce);
	}

	public function get_published_pegawai()
	{
		$q = $this->Model_pegawai->get_published();
		return $q;
	}

	public function simpan()
	{
		if ($this->uri->segment(4) == "admin") {
			$role = 1;
		}else{
			$role = 0;
		}
		$credential = array(
			'login_id' => "LGN-".rand(99999999, 1)."-".date("Ymdhis") , 
			'user_id' => $this->input->post('id_pegawai') , 
			'username' => $this->input->post('username') , 
			'password' => $this->input->post('password') , 
			'user_login_role' => $role , 
		);

		$this->Model_auth->simpan($credential);
		redirect('admin/user/'.$this->uri->segment(4));
	}

	public function update()
	{
		$id = $this->input->post('login_id');
		$credential = array(
			'username' => $this->input->post('username') ,
			'password' => $this->input->post('password') , 
		);

		$q = $this->Model_auth->update_password_uname($id, $credential);
		if ($q) {
			redirect('admin/user/'.$this->uri->segment(4));
		}
	}

	public function thisUser()
	{
		// $user = json_decode($this->input->cookie('1login_ebonpas',true), true);
		$user = $this->session->userdata('admin_ebonpas');
		$data = $this->Model_pegawai->get_one_pegawai_published($user['current_user_id']);
		return $data;
		// echo var_dump($data);
	}

}

/* End of file User.php */
/* Location: ./application/controllers/admin/User.php */