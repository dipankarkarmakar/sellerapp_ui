//setColor
function setColor(data){
    switch(data){
        case "Low":
        return `<span class="red-bar"></span>
        <span class="red-bar"></span>
        <span class="red-bar"></span>`
        break;
        case "Medium":
        return `<span class="yellow-bar"></span>
        <span class="yellow-bar"></span>
        <span class="yellow-bar"></span>`
        break;
        case "High":
        return `<span class="green-bar"></span>
        <span class="green-bar"></span>
        <span class="green-bar"></span>`
        break;

    }
}

// Get keyword and volume
function getKeywordAndVolume(data) {
    var dataTableArr = [];
    $.each(data, function(i,val){
        var indKeywordArr = [];
        indKeywordArr.push(val.keyword);
        allWordContainer(val.keyword);
        indKeywordArr.push(val['search_volume'].label);
        dataTableArr.push(indKeywordArr);
    });
    $('#keyword-table').DataTable( {
        destroy: true,
        data: dataTableArr,
        "deferRender": true,
        columns: [
            { title: "Keyword" },
            { title: "Search Volume" }
        ],
        "columnDefs": [
            {
                "targets": -1,
                "data": null,
                "bSortable": false,
                "render": function(d, t, r){
                    return setColor(d[1]);
                }
            },
        ]
    });
    $(".table-row").css("display","flex");
    getFrequentWords(allWordArr);
}

// Frequent words list
var allWordArr = [];
function allWordContainer(data) {
    var splitedData = data.split(" ");
    $.each(splitedData, function(i,val) {
        allWordArr.push(val);
    });
}

// Sort frequent word arr
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

//get count of repeated values
function getFrequentWords(data){
    allWordArr.sort();
    var current = null;
    var cnt = 0;
    var allWordCountArr = [];
    for (var i = 0; i < allWordArr.length; i++) {
        var wordArr= [];
        if (allWordArr[i] != current) {
            if (cnt > 0) {
                wordArr.push(cnt);
                wordArr.push(current);
                allWordCountArr.push(wordArr);
            }
            current = allWordArr[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        wordArr.push(cnt);
        wordArr.push(current);
        allWordCountArr.push(wordArr);
    }
    allWordCountArr.sort(sortFunction).reverse();
    $(".frequent-word-container").html('');
    for(var i = 0; i < 5; i++){
        $(".frequent-word-container").append('<span>' + allWordCountArr[i][1] +'(' + allWordCountArr[i][0] + ')</span>');
    }
}

// AJAX call on click
$(document).ready(function(){
    $(".s_search_btn").click(function(){
        var input_val = $(".s_search").val();
        $.ajax({
            type: "POST",
            url: "https://demo4044296.mockable.io/getKeywords",
            data: input_val,
            success: function(data){
                allWordArr = [];
                getKeywordAndVolume(data.keywords['suggested_keywords']);
            }
        });
    });
});