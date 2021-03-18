// $(document).ready(function (dataSet) {
//     var table=$('#datatables').DataTable({
//             pageLength : 5,
//             lengthMenu: [[5, 10, 20, -1],[5, 10, 20, "All"]],
//             data:dataSet,
//             responsive: true,
//             language: {
//                 search: "_INPUT_",
//                 searchPlaceholder: "Search records",
//             },
//             // columnDefs:[
//             //     {
//             //         targets:[0],
//             //         visible:false,
//             //     },
//             //     {
//             //         targets:-1,
//             //         defaultContent:"<div>default content</div>",
//             //     },
//             // ]

//         });

//         $('.card .material-datatables label').addClass('form-group');
//     });
$(document).ready(function() {
    console.log('short table');
    $('#datatables').DataTable({
        "pagingType": "full_numbers",
        "lengthMenu": [
            [5, 10, 15, -1],
            [5, 10, 15, "All"]
        ],
        responsive: true,
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search records",
        }

    });


    // var table = $('#datatables').DataTable();

    // // Edit record
    // table.on('click', '.edit', function() {
    //     $tr = $(this).closest('tr');

    //     var data = table.row($tr).data();
    //     alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
    // });

    // // Delete a record
    // table.on('click', '.remove', function(e) {
    //     $tr = $(this).closest('tr');
    //     table.row($tr).remove().draw();
    //     e.preventDefault();
    // });

    // //Like record
    // table.on('click', '.like', function() {
    //     alert('You clicked on Like button');
    // });

    $('.card .material-datatables label').addClass('form-group');
});