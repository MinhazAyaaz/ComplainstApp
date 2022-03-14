package com.example.complainstapp;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class RecyclerAdapter extends RecyclerView.Adapter<RecyclerAdapter.complaintViewHolder> {

    private Complaint[] complaints;

    public RecyclerAdapter(Complaint[] complaints) {
        this.complaints = complaints;
    }

    @NonNull
    @Override
    public complaintViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.card_layout,parent,false);

        return new complaintViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerAdapter.complaintViewHolder viewHolder, int position) {
        viewHolder.bind(complaints[position]);

    }

    @Override
    public int getItemCount() {
        return complaints.length;
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

        }

        public void bind(Complaint complaints){
            title.setText(complaints.title);
            against.setText(complaints.against);
            description.setText(complaints.description);
        }

    }



}
