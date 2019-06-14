<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Master_kamar extends CI_Controller {
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
		$data['kamar_list'] = $this->get_all_published();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/master_kamar', $data);
		$this->load->view('admin/partial/footer');		
	}

	public function tambah()
	{
		$data['blok_list'] = $this->get_blok();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/master_kamar_tambah', $data);
		$this->load->view('admin/partial/footer');	
	}

	public function edit()
	{
		$id = $this->uri->segment(4);
		$data['kamar'] = $this->get_one_kamar($id);
		$data['blok_list'] = $this->get_blok();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/master_kamar_edit', $data);
		$this->load->view('admin/partial/footer');	
	}

	// functionality

	public function get_one_kamar($id)
	{
		$q = $this->Model_kamar->get_one_published($id);
		return $q;
	}
	public function get_all_published()
	{
		$q = $this->Model_kamar->get_all_published();
		return $q;
	}

	public function get_blok()
	{
		$q = $this->Model_blok->get_all_published();
		return $q;
	}

	public function simpan()
	{
		$credential = array(
			'master_kamar_id' => "KMR-".rand(999999999, 1)."-".date("Ymdhis"),
			'nama_kamar' => $this->input->post('nama_kamar'),
			'master_blok_id' => $this->input->post('blok_kamar'),
		);
		$this->Model_kamar->simpan($credential);
		redirect('/admin/master_kamar');
	}

	public function update()
	{
		$id = $this->input->post('master_kamar_id');
		$credential = array(
			'nama_kamar' => $this->input->post('nama_kamar'),
			'master_blok_id' => $this->input->post('blok_kamar'),
		);
		$this->Model_kamar->update($id,$credential);
		redirect('/admin/master_kamar');
	}

	public function thisUser()
	{
		// $user = json_decode($this->input->cookie('1login_ebonpas',true), true);
		$user = $this->session->userdata('admin_ebonpas');
		$data = $this->Model_pegawai->get_one_pegawai_published($user['current_user_id']);
		return $data;
	}

}

/* End of file Master_kamar.php */
/* Location: ./application/controllers/admin/Master_kamar.php */