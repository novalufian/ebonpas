<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		$this->load->view('welcome_message');
	}

	public function test()
	{
	    header("Content-Type: application/vnd.msword");
          header("Expires: 0");//no-cache
          header("Cache-Control: must-revalidate, post-check=0, pre-check=0");//no-cache
          header("content-disposition: attachment;filename=sampleword.doc");
          echo "
          <html>
          <h1 style='color:red'>string</h1>
          </html>";
	}

	public function test2()
	{
		$content = array(
	            "en" => "msg",
	       );
	        
	      $head = array(
	            "en" => 'Pemberitahuan pesan baru!',
	      );
	      $fields = array(
	            'app_id' => "0a43ccb3-f3d8-441d-8206-7b06d43a7132",
	            'included_segments' => array("Active Users"),
	            'data' => array("foo" => "bar"),
	            'url' => "https://google.com",
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
		$this->curl->option(CURLOPT_POSTFIELDS ,$encodedJsonData);
		// $this->curl->post($encodedJsonData);
		$response = $this->curl->execute();

	    $r['res'] = $response;
	    $r['data'] = $this->curl->info;
	    echo json_encode($r);
	}


}
