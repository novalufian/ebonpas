<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pegawai extends CI_Controller {
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
		$data['pegawai'] = $this->get_published_pegawai();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/pegawai', $data);
		$this->load->view('admin/partial/footer');
	}

	public function tambah()
	{
		$data['subagian_list'] = $this->get_subagian_list();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/pegawai-tambah', $data);
		$this->load->view('admin/partial/footer');
	}

	public function edit()
	{
		$id = $this->uri->segment(4);
		$data['target_pegawai'] = $this->get_pegawai($id);
		$data['subagian_list'] = $this->get_subagian_list();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/pegawai-edit', $data);
		$this->load->view('admin/partial/footer');
	}

	// funtionality
	public function get_published_pegawai()
	{
		$q = $this->Model_pegawai->get_published();
		return $q;
	}

	public function get_subagian_list()
	{
		$q = $this->Model_master_subag->get_all_published();
		return $q;
	}

	public function get_pegawai($id)
	{
		$q = $this->Model_pegawai->get_one_pegawai_published($id);
		return $q;
	}

	public function simpan()
	{
		$id = "USR-".rand(999999999,1)."-".date('Ymdhis');
		$ext = explode(".",$_FILES['ttd_pegawai']['name'])[1];
		$new_name = "ttd-".$id.".".$ext;
		$simpan_ttd = $this->simpan_ttd($new_name);

		if ($simpan_ttd) {
			$credential = array(
				'user_id' => $id, 
				'nip_pegawai' => $this->input->post('nip_pegawai'), 
				'nama_pegawai' => $this->input->post('nama_pegawai'), 
				'subag_pegawai' => $this->input->post('subag_pegawai'), 
				'jenis_kelamin_pegawai' => $this->input->post('sex_pegawai'), 
				'ttd_pegawai' => base_url()."uploads/pegawai/".$new_name, 
			);

			$this->Model_pegawai->simpan_data($credential);
			redirect('/admin/pegawai','refresh');
		}
	}

	public function update()
	{
		$user_id = $this->input->post('user_id'); 
		if ($_FILES['ttd_pegawai']['name'] == "") {
			$filename = $this->input->post('ttd_pegawai_edit');
			$this->simpan_ttd($filename);
		}
		$credential = array(
			'nip_pegawai' => $this->input->post('nip_pegawai'), 
			'nama_pegawai' => $this->input->post('nama_pegawai'), 
			'subag_pegawai' => $this->input->post('subag_pegawai'), 
			'jenis_kelamin_pegawai' => $this->input->post('sex_pegawai'), 
		);
		$this->Model_pegawai->update_data($user_id,$credential);
		redirect('/admin/pegawai','refresh');
	}

	public function delete()
	{
		$current_target_id = $this->uri->segment(4);
		$this->Model_pegawai->unpublish_data($current_target_id);
		redirect('/admin/pegawai','refresh');
	}

	public function simpan_ttd($filename)
	{
		$config['upload_path'] = './uploads/pegawai/';
		$config['allowed_types'] = 'png|jpg|jpeg';
		$config['file_name'] = $filename;
		$config['overwrite'] = TRUE;

		$this->load->library('upload', $config);
		$this->upload->initialize($config);
		if ( ! $this->upload->do_upload('ttd_pegawai')){
			return false;
		}
		else{
			return true;
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

/* End of file Pegawai.php */
/* Location: ./application/controllers/admin/Pegawai.php */