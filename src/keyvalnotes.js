var MAIN_KEY = 'foo-92jd63kd';

var Keys = {
    POST_IDS: MAIN_KEY + '-i',
    COUNTER: MAIN_KEY + '-c',
    POST_PREFIX: MAIN_KEY + '-p-'
};

$(function() {
    displayPosts();
    $('#post-button').click(createPost);
});

function pushPost(text) {
    $('#output').append('<p>' + text + '<p>');
}

function displayPosts() {
    function fetchPosts(idList) {
        if (idList == 'null') {
            return;
        }

        var ids = idList.split(',');

        for (var i = 0, len = ids.length; i < len; i++) {
            var key = Keys.POST_PREFIX + ids[i];
            window.remoteStorage.getItem(key, pushPost);
        }
    };
    window.remoteStorage.getItem(Keys.POST_IDS, fetchPosts);
};

function createPost() {
    var id = null;
    var text = $('#input').val();

    function displayPost() {
        console.log('displayPost', text);
        pushPost(text);
    }

    function updatePostList(ids) {
        if (ids == 'null') {
            ids = '' + id;
        } else {
            ids += ',' + id;
        }
        console.log('updatePostList', ids);
        window.remoteStorage.setItem(Keys.POST_IDS, ids, displayPost);
    }

    function getPostList() {
        console.log('getPostList', text);
        window.remoteStorage.getItem(Keys.POST_IDS, updatePostList);
    }

    function savePost() {
        var key = Keys.POST_PREFIX + id;
        console.log('savePost', key, text);
        window.remoteStorage.setItem(key, text, getPostList);
    }

    function incrementId(strId) {
        console.log('incrementId', strId);
        id = parseInt(strId, 10);
        if (isNaN(id)) {
            id = 0;
        }
        window.remoteStorage.setItem(Keys.COUNTER, id + 1, savePost);
    }

    window.remoteStorage.getItem(Keys.COUNTER, incrementId);
}

function reset() {
    window.remoteStorage.deleteItem(Keys.POST_IDS);
}
