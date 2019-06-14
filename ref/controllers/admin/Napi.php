<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Napi extends CI_Controller {
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
		$data['all_napi'] = $this->get_published_napi();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/napi', $data);
		$this->load->view('admin/partial/footer');
	}

	public function tambah()
	{
		$data['blok_list'] = $this->get_master_blok();
		// echo json_encode($data);
		// die();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/napi-tambah', $data);
		$this->load->view('admin/partial/footer');
	}

	public function napi_by_kamar()
	{
		$kamarId = $this->uri->segment(4);
		if ($kamarId == "undefined") {
			$data["list_napi"] = $this->Model_napi->get_all_published();
		}else{
			$data["list_napi"] = $this->Model_napi->get_by_kamarid($kamarId);
		}
		$data['kamar_id'] = $kamarId;
		$this->load->view('admin/page/napi_by_kamar', $data);

	}

	public function edit()
	{
		$id = $this->uri->segment(4);
		$data['data_napi'] = $this->get_napi_one($id);
		$data['blok_list'] = $this->get_master_blok();

		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/napi-edit', $data);
		$this->load->view('admin/partial/footer');
	}

	// functionality
	public function get_master_blok()
	{
		$q = $this->Model_blok->get_all_published();
		return $q;
	}
	public function get_published_napi()
	{
		$q = $this->Model_napi->get_all_published();
		return $q;
	}

	public function get_napi_one($id)
	{
		$q = $this->Model_napi->get_one_napi($id);
		return $q;
	}

	public function delete()
	{
		$id = $this->uri->segment(4);
		$q = $this->Model_napi->napi_unpublished($id);
		redirect('/admin/napi/');
	}

	public function simpan()
	{
		$id = "NPI-".rand(99999999, 1)."-".date("Ymdhis");
		$ext = explode(".",$_FILES['foto_napi']['name'])[1];
		$new_name = "foto-".$id.".".$ext;
		$upload = $this->simpan_gambar($new_name);
		if ($upload) {
			$credential = array(
				'napi_id' =>  $id, 
				'napi_no_reg' => $this->input->post('napi_no_reg'),
				'napi_nama' => $this->input->post('napi_nama'),
				'napi_sex' => $this->input->post('napi_sex'),
				'napi_kamar' => $this->input->post('napi_kamar'),
				'napi_foto' => base_url().'uploads/napi/'.$new_name
			);
			$this->Model_napi->napi_simpan($credential);
			redirect('/admin/napi/');
		}

	}

	public function simpan_gambar($filename)
	{
		$config['upload_path'] = './uploads/napi/';
		$config['allowed_types'] = 'gif|jpg|png|jpeg';
		$config['file_name'] = $filename;
		$config['overwrite'] = TRUE;
		
		$this->load->library('upload', $config);
		$this->upload->initialize($config);
		if ( ! $this->upload->do_upload('foto_napi')){
			return false;
		}
		else{
			return true;
		}
	}

	public function update()
	{
		$id = $this->input->post('napi_id');
		if ($_FILES['foto_napi']['name'] == "") {
			$credential = array(
				'napi_no_reg' => $this->input->post('napi_no_reg'),
				'napi_nama' => $this->input->post('napi_nama'),
				'napi_sex' => $this->input->post('napi_sex'),
				'napi_kamar' => $this->input->post('napi_kamar'),
			);
			$this->Model_napi->napi_update($id, $credential);
			redirect('/admin/napi/');
		}else{
			$upload = $this->simpan_gambar($this->input->post('napi_foto_name'));
			if ($upload) {
				$credential = array(
					'napi_id' =>  $id, 
					'napi_no_reg' => $this->input->post('napi_no_reg'),
					'napi_nama' => $this->input->post('napi_nama'),
					'napi_sex' => $this->input->post('napi_sex'),
					'napi_kamar' => $this->input->post('napi_kamar'),
					'napi_foto' => base_url()."uploads/napi/".$this->input->post('napi_foto_name')
				);
				$this->Model_napi->napi_update($id, $credential);
				redirect('/admin/napi/');
			}
		}
	}

	public function thisUser()
	{
		// $user = json_decode($this->input->cookie('1login_ebonpas',true), true);
		$user = $this->session->userdata('admin_ebonpas');
		$data = $this->Model_pegawai->get_one_pegawai_published($user['current_user_id']);
		return $data;
	}


	// coutn satist

}

/* End of file Napi.php */
/* Location: ./application/controllers/admin/Napi.php */