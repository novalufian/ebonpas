<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kamar extends CI_Controller {
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
		
		$data['list_blok'] = $this->get_blok();
		$data['list_kamar'] = $this->get_kamar();
		$data['list_napi'] = $this->get_napi();

		// echo json_encode($data);
		// die();

		$this->load->view('client/partial/header');
		$this->load->view('client/page/kamar', $data);
		$this->load->view('client/partial/footer');
	}

	// functionality
	public function get_blok()
	{
		$q = $this->Model_blok->get_all_published();
		return $q;
	}

	public function get_kamar()
	{
		$q = $this->Model_kamar->get_all_published();
		return $q;
	}

	public function get_napi()
	{
		$q = $this->Model_napi->get_all_published();
		return $q;
	}

	public function statistik()
	{
		$kamarId = $this->uri->segment(3);
		if ($kamarId == "undefined") {
			$kamarId = null;
		}else{
			$kamarId = $this->uri->segment(3);
		}
		echo '<div class="row">';
		echo '<span class="bg-light fg cell-8">Total napi </span><span class="bg-light cell-4"> : '. $this->Model_napi->count_all_napi($kamarId).'</span>';
		echo '<span class="bg-light cell-8">Napi didalam blok </span><span class="bg-light cell-4"> : '. $this->Model_napi->count_all_napi_unbooked($kamarId).'</span>';
		echo '<span class="bg-light cell-8">Total napi diluar blok </span><span class="bg-light cell-4"> : '. ((int)$this->Model_napi->count_all_napi($kamarId) - (int)$this->Model_napi->count_all_napi_unbooked($kamarId)).'</span>';
		echo '</div>';
		echo '<div class="clearfix"></div>';
		echo '<br>';
		echo 'keterangan : ';
		echo '<div class="row">';
		$subag = $this->Model_master_subag->get_all_published();
		foreach ($subag as $item) {
			echo '<span class="'.$item["bagian_warna"].' fg cell-8">'.$item["nama"].' </span><span class="'.$item["bagian_warna"].' cell-4"> : '. $this->Model_napi->count_all_napi_by_subag($kamarId, $item["subagian_id"]).'</span>';
		}
		echo '</div>';

	}

}

/* End of file kamar.php */
/* Location: ./application/controllers/client/kamar.php */