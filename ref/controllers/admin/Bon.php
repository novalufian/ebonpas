<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Bon extends CI_Controller {
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
		$data['curent_user'] = $this->thisUser();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/bon', $data);
		$this->load->view('admin/partial/footer');
	}

	public function riwayat()
	{
		$data['list_bon'] = $this->get_bon();
		$this->load->view('admin/partial/header');
		$this->load->view('admin/page/bon-riwayat', $data);
		$this->load->view('admin/partial/footer');
	}

	public function selesai()
	{
		$id = $this->uri->segment(4);
		$data['bon_list'] = $this->Model_bon->get_by_id($id);
		$data['detail_bon_list'] = $this->Model_detail_bon->get_by_bon_id($id);
		foreach ($data['detail_bon_list'] as $napi) {
			$credential = array(
				'napi_booked' => false, 
				'napi_booked_by' => "", 
			);
			$this->Model_napi->napi_update($napi['napi_id'], $credential);
		}
		$id = $this->uri->segment(4);
		$data = array('bon_status' =>'selesai');
		$this->Model_bon->update($id, $data);

		$bonData = $this->Model_bon->get_by_id($id);
		$userDestiny = $bonData[0]['bon_user'];

		// send notification
		$user = $this->thisUser();
		$user_id = $user[0]['user_id'];
		$notif_credential = array(
			'notif_user_id' => $user_id, 
			'notif_user_destiny' => $userDestiny, 
			'notif_user_role' => 0,
			'notif_url' => base_url()."/index.php/bon/detail/".$id,
			'notif_msg' => "<strong>".$user[0]['nama_pegawai']."</strong> menyelesaikan permintaan bon anda.",
		);

		// setelah fcm pushed
		// save notif to db
		$this->Model_notif->save($notif_credential);
		$this->sendMessage($notif_credential);
		
		redirect('/admin/bon/riwayat');

	}


	public function detail()
	{
		$id = $this->uri->segment(4);
		$data['bon_list'] = $this->Model_bon->get_by_id($id);
		$data['detail_bon_list'] = $this->Model_detail_bon->get_by_bon_id($id);
		$download = $this->uri->segment(5);
		if ($download == "word") {
			$this->load->view('admin/page/bon-detail-word', $data);
		}else{
			$this->load->view('admin/partial/header');
			$this->load->view('admin/page/bon-detail', $data);
			$this->load->view('admin/partial/footer');
		}

	}

	public function get_bon()
	{
		$q = $this->Model_bon->get_all_data();
		return $q;
	}

	public function add_to_cart_bon()
	{
		$data['id'] = $this->uri->segment(4);
		$data['nama'] = $this->uri->segment(5);
		$data['kamar'] = $this->uri->segment(6);
		$dataArray = array(
		        'id'      => $data['id'],
		        'name'    => $data['nama'],
		        'qty'     => 1,
		        'price'   => 'a',
		        'coupon'  => $data['kamar']
		);
		$user = $this->thisUser();
		$data['update'] = array(
			'napi_booked' => true, 
			'napi_booked_by' => $user[0]['subagian_id']
		);
		$this->Model_napi->napi_update($data['id'], $data['update']);
		$this->cart->insert($dataArray);



	}

	public function remove_to_cart()
	{
		$id = $this->uri->segment(4);
		$napi = $this->cart->get_item($id);
		$data['update'] = array(
			'napi_booked' => false, 
			'napi_booked_by' => ""
		);
		$this->Model_napi->napi_update($napi['id'], $data['update']);
		$this->cart->remove($id);
		redirect('/admin/bon/');
	}
	
	public function kirim_bon()
	{
		$curent_user = $this->thisUser();
		$bonId = "BON-".rand(99999999, 1)."-".date("Ymdhis");
		$credential = array(
			'bon_id' => $bonId, 
			'bon_user' => $curent_user[0]['user_id'],
			'bon_keterangan'=> $this->input->post('keperluan_bon'),
			'bon_subagian' => $curent_user[0]['subag_pegawai'],
			'bon_status' => 'menunggu',
			'bon_jam_keluar'=> date_format(date_create($this->input->post('jam_keluar')),"Y-m-d H:i:s"),
			'bon_jam_masuk'=> date_format(date_create($this->input->post('jam_masuk')),"Y-m-d H:i:s"),
		);

		$q = $this->Model_bon->simpan($credential);
		if ($q) {
                  foreach ($this->cart->contents() as $items){ 
                  	$detailBon = array(
                  		'bon_detail_id' => "BDT-".rand(99999999, 1)."-".date("Ymdhis") ,
                  		'bon_id' => $bonId,
                  		'napi_id' =>$items['id']
                  	);

                  	$this->Model_detail_bon->simpan($detailBon);
                  }
			$this->cart->destroy();
		}

		// send notification
		$user = $this->thisUser();
		$user_id = $user[0]['user_id'];
		$notif_credential = array(
			'notif_user_id' => $user_id, 
			'notif_user_role' => 1,
			'notif_url' => base_url()."/index.php/admin/bon/detail/".$bonId,
			'notif_msg' => $user[0]['nama_pegawai']." mengirimkan permintaan bon.",
		);

		// setelah fcm pushed
		// save notif to db
		$this->Model_notif->save($notif_credential);
		$this->sendMessage($notif_credential);

		redirect('/admin/bon/riwayat');


	}

	public function terima()
	{
		$id = $this->uri->segment(4);
		$data = array('bon_status' =>'diterima');
		$this->Model_bon->update($id, $data);
		
		$bonData = $this->Model_bon->get_by_id($id);
		$userDestiny = $bonData[0]['bon_user'];

		// send notification
		$user = $this->thisUser();
		$user_id = $user[0]['user_id'];
		$notif_credential = array(
			'notif_user_id' => $user_id, 
			'notif_user_destiny' => $userDestiny, 
			'notif_user_role' => 0,
			'notif_url' => base_url()."/index.php/bon/detail/".$id,
			'notif_msg' => "<strong>".$user[0]['nama_pegawai']."</strong> meneriama permintaan bon anda.",
		);

		// setelah fcm pushed
		// save notif to db
		$this->Model_notif->save($notif_credential);
		$this->sendMessage($notif_credential);
		redirect('/admin/bon/riwayat');
	}

	public function tolak()
	{
		$id = $this->uri->segment(4);
		$data['bon_list'] = $this->Model_bon->get_by_id($id);
		$data['detail_bon_list'] = $this->Model_detail_bon->get_by_bon_id($id);
		foreach ($data['detail_bon_list'] as $napi) {
			$credential = array(
				'napi_booked' => false, 
				'napi_booked_by' => "", 
			);
			$this->Model_napi->napi_update($napi['napi_id'], $credential);
		}
		
		$id = $this->uri->segment(4);
		$data = array('bon_status' =>'arsip');
		$this->Model_bon->update($id, $data);

		$bonData = $this->Model_bon->get_by_id($id);
		$userDestiny = $bonData[0]['bon_user'];

		// send notification
		$user = $this->thisUser();
		$user_id = $user[0]['user_id'];
		$notif_credential = array(
			'notif_user_id' => $user_id, 
			'notif_user_destiny' => $userDestiny, 
			'notif_user_role' => 0,
			'notif_url' => base_url()."/index.php/bon/detail/".$id,
			'notif_msg' => "<strong>".$user[0]['nama_pegawai']."</strong> menolak permintaan bon anda.",
		);

		// setelah fcm pushed
		// save notif to db
		$this->Model_notif->save($notif_credential);
		$this->sendMessage($notif_credential);

		redirect('/admin/bon/riwayat');
	}


	public function thisUser()
	{
		// $user = json_decode($this->input->cookie('1login_ebonpas',true), true);
		$user = $this->session->userdata('admin_ebonpas');
		$data = $this->Model_pegawai->get_one_pegawai_published($user['current_user_id']);
		return $data;
		// echo var_dump($data);
	}

	public function sendMessage($data)
    {
    	$content = array(
	            "en" => $data['notif_msg'],
	       );
	        
	      $head = array(
	            "en" => 'Pemberitahuan pesan baru!',
	      );
	      $fields = array(
	            'app_id' => "0a43ccb3-f3d8-441d-8206-7b06d43a7132",
	            'included_segments' => array("Active Users"),
	            'data' => array("foo" => "bar"),
	            'url' => $data['notif_url'],
	            'contents' => $content,
	            'headings' => $head
	      );
		$encodedJsonData = json_encode($fields);
	        
		$this->curl->create('https://onesignal.com/api/v1/notifications');
		$this->curl->options(array(CURLOPT_HTTPHEADER => array('Content-Type: application/json; charset=utf-8','Authorization: Basic YTdmNTI2YjctMWZjNi00YmFlLTkzMzEtM2E1NmExOTI3YmIw')));
		$this->curl->option(CURLOPT_RETURNTRANSFER ,TRUE);
		$this->curl->option(CURLOPT_HEADER ,FALSE);
		$this->curl->option(CURLOPT_POST ,TRUE);
		$this->curl->option(CURLOPT_SSL_VERIFYPEER ,FALSE);
		$this->curl->post($encodedJsonData);
		$response = $this->curl->execute();
		echo $response;
    }

}

/* End of file Bon.php */
/* Location: ./application/controllers/admin/Bon.php */