<?php

namespace App;


use App\Users;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

use Illuminate\Database\Eloquent\Model;

class Cards extends Model
{
    protected $table = "cards";
	protected $primaryKey = "cards_id";
    protected $fillable = ['name','user_id','task_id','created_at', 'updated_at'];


    public function tasks() {
        return $this->belongsTo('App\TasksLists');
    }

    public function users() {
        return $this->belongsToMany('App\Users', 'cards_users', 'cards_id', 'users_id');
    }

    public function usersRelation() {
        return $this->hasMany('App\CardsUsers', 'cards_id');
    }

    public function comments() {
        return $this->belongsToMany('App\CardsComments', 'cards_users', 'cards_id', 'users_id');
    }

    public function checkLists() {
        return $this->hasMany('App\Checklists', 'cards_id');
    }

    public function cardComments() {
        return $this->hasMany('App\CardsComments', 'cards_id');
    }


    public function getCardPreview($card_id)
    {

        $card = Cards::find($card_id);
        $card_preview = new Cards();
        $card_preview->assign_to_card = $card->users->contains('users_id', Auth::user()->users_id);

        foreach ($card->checkLists as $checklist) {
            $all_checkboxes[$card->cards_id][] = $checklist->checkBoxes->count();
            $total_checked_checkboxes[$card->cards_id][] =  $checklist->checkBoxes->where('status', 1)->count();
        }

        if ( ! empty($all_checkboxes[$card->cards_id])) {
            $card_preview->all_checkboxes = array_sum($all_checkboxes[$card->cards_id]);
        }else {
            $card_preview->all_checkboxes = NULL;
        }

        if ( ! empty($total_checked_checkboxes[$card->cards_id])) {
            $card_preview->checked_checkboxes = array_sum($total_checked_checkboxes[$card->cards_id]);
        }else {
            $card_preview->checked_checkboxes = NULL;
        }

        if( ! empty($card->deadline)) {
            $card_preview->deadline_preview = date("M d", strtotime($card->deadline));
        }else {
            $card_preview->deadline_preview = NULL;
        }

        if( ! empty($card->description)) {
            $card_preview->description = true;
        }else {
            $card_preview->description = NULL;
        }

        $card_preview->comments_amount = $card->cardComments()->get()->count();
        return $card_preview;
    }

}
