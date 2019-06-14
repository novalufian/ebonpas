<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Napi extends CI_Controller {
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
		$data['all_napi'] = $this->get_published_napi();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/napi', $data);
		$this->load->view('admin/partial/footer');
	}

	public function napi_by_kamar()
	{
		$kamarId = $this->uri->segment(3);
		if ($kamarId == "undefined") {
			$data["list_napi"] = $this->Model_napi->get_all_published();
		}else{
			$data["list_napi"] = $this->Model_napi->get_by_kamarid($kamarId);
		}
		$data['kamar_id'] = $kamarId;
		$this->load->view('admin/page/napi_by_kamar', $data);

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
		$id = $this->uri->segment(3);
		$q = $this->Model_napi->napi_unpublished($id);
		redirect('/admin/napi/');
	}

}

/* End of file Napi.php */
/* Location: ./application/controllers/admin/Napi.php */