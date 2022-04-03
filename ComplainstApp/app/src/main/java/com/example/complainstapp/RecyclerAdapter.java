package com.example.complainstapp;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class RecyclerAdapter extends RecyclerView.Adapter<RecyclerAdapter.complaintViewHolder> {

    private ArrayList<Complaint> complaints;
    private final ClickListener clickListener;

    public RecyclerAdapter(ArrayList<Complaint> complaints,ClickListener clickListener) {
        this.complaints = complaints;
        this.clickListener = clickListener;
    }

    @NonNull
    @Override
    public complaintViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.card_layout,parent,false);

        return new complaintViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerAdapter.complaintViewHolder viewHolder, int position) {
        viewHolder.bind(complaints.get(position));
    }

    @Override
    public int getItemCount() {
        return complaints.size();
    }

    public class complaintViewHolder extends RecyclerView.ViewHolder{

        private TextView title;
        private TextView against;
        private TextView description;

        public complaintViewHolder(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.cardTitle);
            against = itemView.findViewById(R.id.cardAgainst);
            description = itemView.findViewById(R.id.cardDescription);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if(clickListener != null){
                        int pos = getBindingAdapterPosition();

                        if(pos != RecyclerView.NO_POSITION){
                            clickListener.onItemClicked(pos);
                        }
                    }
                }
            });
        }

        public void bind(Complaint complaints){
            title.setText(complaints.title);
            against.setText(complaints.against);
            description.setText(complaints.description);
        }

    }



}
