<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\TaskList;

class Task extends Model
{
    protected $table = "task";

    protected $fillable = ['name','user_id','created_at', 'updated_at'];


    public function tasks() {
        return $this->hasMany('App\TaskList');
    }

}
