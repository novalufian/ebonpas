<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Notif extends CI_Controller {

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
		
	}

	public function getNotifAdmin()
	{
		$user = $this->thisUser();
		$user_id = $user[0]['user_id'];
		$data['notif'] = $this->Model_notif->get_all_unread_admin(1);
		$this->load->view('/admin/page/notifadmin', $data);
	}

	public function getNotif()
	{
		// get notif 
		//  query ke db
		//  mengabil data yg belum di read
		// by id user
		$user = $this->thisUser();
		$user_id = $user[0]['user_id'];

		// $data = $this->Model_notif->get_all_unread_admin(1);
		$data['notif'] = $this->Model_notif->get_all_unread_by_user($user_id, 0);
		$data['notif_readed'] = $this->Model_notif->get_all_read_by_user($user_id, 0);
		$this->load->view('/admin/page/notif', $data);
	}

	public function readNotif()
	{
		// update db
		// whre false to true
		// by id user
		$user = $this->thisUser();
		$user_id = $user[0]['user_id'];
		$this->Model_notif->update_notif_to_read_state($user_id, 0);
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

/* End of file Notif.php */
/* Location: ./application/controllers/admin/Notif.php */