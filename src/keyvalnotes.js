var MAIN_KEY = 'foo-q3ehksk';

var Keys = {
    POST_IDS: MAIN_KEY + '-i',
    COUNTER: MAIN_KEY + '-c',
    POST_PREFIX: MAIN_KEY + '-p-'
};

$(function() {
    window.log = new Log($('#log'));
    displayPosts();
    $('#post-button').click(createPost);
});

function Log($log) {
    function info(msg) {
        $log.append($('<p>').text(msg));
    }
    function clear() {
        $log.empty();
    }
    return {
        'info': info,
        'clear': clear
    };
}

function pushPost(text) {
    $('#output').append('<p>' + text + '<p>');
}

function displayPosts() {
    function fetchPosts(idList) {
        if (idList == null) {
            log.info('No notes to fetch, try creating one.');
            return;
        }

        var ids = idList.split(',');
        log.info('Fetching ' + ids.length + ' note(s)...');

        for (var i = 0, len = ids.length; i < len; i++) {
            var key = Keys.POST_PREFIX + ids[i];
            window.remoteStorage.getItem(key, pushPost);
        }
    };

    log.clear();
    window.remoteStorage.getItem(Keys.POST_IDS, fetchPosts);
};

function createPost() {
    var id = null;
    var text = $('#input').val();

    function displayPost() {
        log.info('displayPost: ' + text);
        pushPost(text);
    }

    function updatePostList(ids) {
        if (ids == null) {
            ids = '' + id;
        } else {
            ids += ',' + id;
        }
        log.info('updatePostList: ' + ids);
        window.remoteStorage.setItem(Keys.POST_IDS, ids, displayPost);
    }

    function getPostList() {
        log.info('getPostList');
        window.remoteStorage.getItem(Keys.POST_IDS, updatePostList);
    }

    function savePost() {
        var key = Keys.POST_PREFIX + id;
        log.info('savePost: [' + key + ']: ' + text);
        window.remoteStorage.setItem(key, text, getPostList);
    }

    function incrementId(strId) {
        id = parseInt(strId, 10);
        if (isNaN(id)) {
            id = 0;
        }
        id = id + 1;
        log.info('incremented id: ' + id);
        window.remoteStorage.setItem(Keys.COUNTER, id, savePost);
    }

    log.clear();
    window.remoteStorage.getItem(Keys.COUNTER, incrementId);
}

function reset() {
    window.remoteStorage.deleteItem(Keys.POST_IDS);
}
