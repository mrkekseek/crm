<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use DB;
use PDF;
use App\Finances;
use App\Teams;
use App\Products;
use App\Finances_products;
use App\Task;
use App\TaskList;

class PdfController extends Controller
{


    public function downloadPdf($post = []){
     // dd($post);
		//$post
    	//return $request->finances_id; 

    	//return response()->json($post);

    	//return view('finances.pdf');



      //$finances = Finances::find($request->finances_id);

      //$pdf = PDF::loadView('finances.pdf', compact('finances'));
      $pdf = PDF::loadView('finances.pdf');
      //dd($pdf);
      $pdf->download('check.pdf');

      //return redirect()->action('App\Http\Controllers\PdfController@show');
      //return redirect();
      return '';

    }

    public function pdf($id){

      $data = Finances::where('finances_id',$id)->get();
      $team = Teams::find(session('current_team'));
      $finances_products = Finances_products::where('finances_id', $id)->get();


      $products = [];

      foreach($finances_products as $finances_product){
        $product = Products::find($finances_product->products_id);
        array_push($products, $product);
      }

      //return $id;
      //return view('pdf', compact('data', 'team', 'finances_products', 'products'));

      $pdf = PDF::loadView('pdf', compact('data', 'team', 'finances_products', 'products'));
      //dd($pdf);
      return $pdf->download('invoice.pdf');

    }


    public function test(){

      /*
      $tasks = Task::all();
      //return dd($tasks = Task::all());
      //return dd($tasks->tasks());
      $all = [];
      foreach ($tasks as $task)
        {

            //$task_list = TaskList::find('task_id', '=',$task->id);
            $task_list = TaskList::where('task_id',$task->id)->get();
            //return dd($task_list);
            array_push($all, $task_list);
            //return $task->id;

            //return dd($task);
        }

        return dd($all);
        */

        $tasks = Task::all();
      //return dd($tasks = Task::all());
      //return dd($tasks->tasks());
      //$all = [];
        //$tasks->cards;



        $tasks->cards = $mass;

        //return $tasks;

        return dd($mass);

    }

}
