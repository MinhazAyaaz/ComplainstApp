package com.example.cse327

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class RecyclerAdapter: RecyclerView.Adapter<RecyclerAdapter.ViewHolder>() {

    private var titles = arrayOf("Harassment","Sexual Harassment","Unfair Grading","Unprofessional Behavior")

    private var subTitles = arrayOf("FirstName1 LastName1","FirstName2 LastName2","FirstName3 LastName3","FirstName4 LastName4")

    private var details = arrayOf("Detail1","Detail2","Detail3","Detail4")


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerAdapter.ViewHolder{
        val v = LayoutInflater.from(parent.context).inflate(R.layout.card_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return titles.size
    }

    override fun onBindViewHolder (holder: RecyclerAdapter.ViewHolder, position: Int){
        TODO("Not yet implemented")
    }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var itemTitle: TextView
        var itemSubTitle: TextView
        var itemDetail: TextView
        // var buttonEdit: Button
        // var buttonDelete: Button

        init {
            itemTitle = itemView.findViewById(R.id.cardTitle)
            itemSubTitle = itemView.findViewById(R.id.cardSubTitle)
            itemDetail = itemView.findViewById(R.id.cardDetails)
            //buttonEdit = itemView.findViewById(R.id.editButton)
            //buttonDelete = itemView.findViewById(R.id.deleteButton)
        }

    }

}