const soundcloudAPI = new (class {

    constructor(){
    }

    async searchTracks(filterObj){
        return await SC.get('/tracks', filterObj);
    }


    async getUser(user_id){
        return await SC.get('/users/'+user_id);
    }


    async likeTrack(track_id){
        await SC.connect();
        return await SC.put('/me/favorites/'+track_id);
    }

    async unlikeTrack(track_id){
        await SC.connect();
        return await SC.delete('/me/favorites/'+track_id);
    }


    async repostTrack(track_id){
        await SC.connect();
        return await SC.put('/e1/me/track_reposts/'+track_id);
    }

    async unrepostTrack(track_id){
        await SC.connect();
        return await SC.delete('/e1/me/track_reposts/'+track_id);
    }


    async followUser(user_id){
        await SC.connect();
        return await SC.put('/me/followings/'+user_id);
    }

    async unfollowUser(user_id){
        await SC.connect();
        return await SC.delete('/me/followings/'+user_id);
    }


    async postComment(track_id,comment_data){
        // comment_data = {body:"test",timestamp:1500}
        await SC.connect();
        return await SC.post("/tracks/"+track_id+"/comments",{comment:comment_data})
    }

});
