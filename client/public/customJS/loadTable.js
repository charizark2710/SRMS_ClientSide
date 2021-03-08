$(document).ready(function (dataSet) {
    var table=$('#datatables').DataTable({
            pageLength : 5,
            lengthMenu: [[5, 10, 20, -1],[5, 10, 20, "All"]],
            data:dataSet,
            responsive: true,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
            },
            columnDefs:[
                {
                    targets:[0],
                    visible:false,
                },
                {
                    targets:-1,
                    defaultContent:"<div>default content</div>",
                },
            ]

        });

        $('.card .material-datatables label').addClass('form-group');
    });
