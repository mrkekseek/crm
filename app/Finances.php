<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Finances_products;

class Finances extends Model
{
    protected $table = "finances";
    protected $primaryKey = 'finances_id';
    protected $guarded = [];

    public function products()
    {
        return $this->belongsToMany('App\Products', 'finances_products', 'finances_id', 'products_id');
    }

    public function teams()
    {
        return $this->belongsToMany('App\Teams', 'finances_teams', 'finances_id', 'teams_id');
    }

    public function users()
    {
        return $this->belongsTo('App\Users', 'finances_assign_to');
    }
}
