import { client, db } from '../../FireBase/config';
export function loadTable(userEmail) {
    var removedRow;//dòng đã xóa
    var filaEditada; //dòng đang edit
    var dataSet = []
    var table = $('#datatables').DataTable({
        "pagingType": "full_numbers",
        "lengthMenu": [
            [5, 10, 15, -1],
            [5, 10, 15, "All"]
        ],
        "autoWidth": true,
        data: dataSet,
        responsive: true,
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search records",
        },

        columnDefs: [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<button type='button' class='btnEditRequest btn btn-success btn-simple' data-original-title='' title='Update this request' data-toggle='modal' data-dismiss='modal' data-target='#updateBookRoomModal'><i class='material-icons'>edit</i><div class='ripple-container'></div></button><button type='button' class='btnRemoveRequest btn btn-danger btn-simple' data-original-title='' title='Delete this request'><i class='material-icons'>close</i></button>"
            },
            { className: "td-actions text-center", "targets": [5] },
            {
                targets: [3],
                render: function (data) {
                    return moment(data).calendar();
                }
            }
        ],

        // columns: [
        //     { title: "Tile", data: "message" },
        //     { title: "Request Type", data: "typeRequest" },
        //     { title: "Reply Time", data: "sendAt" },
        //     { title: "Status", data: "status" },
        //   ]

    });

    db.ref('notification'.concat('/', userEmail)).on('child_added', snap => {
        console.log("child-add-on");

        // this.setState({ messageToUser: [... this.state.messageToUser, mail] })
        dataSet = [snap.child('id').val(), snap.child('message').val(), snap.child('typeRequest').val(), snap.child('sendAt').val(), snap.child('status').val()]
        table.rows.add([dataSet]).draw();
    })

    db.ref('notification'.concat('/', userEmail)).on('child_removed', snap => {
        table.row(removedRow.parents('tr')).remove().draw();
    })
    db.ref('notification'.concat('/', userEmail)).on('child_changed', snap => {
        dataSet = [snap.child('id').val(), snap.child('message').val(), snap.child('typeRequest').val(), snap.child('sendAt').val(), snap.child('status').val()]
        table.row(filaEditada).data(dataSet).draw();
    });

    $('.card .material-datatables label').addClass('form-group');
    // $('#datatables tbody').on('click', 'button', function () {
    //     var data = table.row($(this).parents('tr')).data();
    //     alert(data[0] + "'s salary is: " + data[5]);
    // });

    //remove
    $("#datatables").on("click", ".btnRemoveRequest", function () {
        removedRow = $(this);
        // Swal.fireClick({
        // title: '¿Está seguro de eliminar el producto?',
        // text: "¡Está operación no se puede revertir!",
        // icon: 'warning',
        // showCancelButton: true,
        // confirmButtonColor: '#d33',
        // cancelButtonColor: '#3085d6',
        // confirmButtonText: 'Borrar'
        // }).then((result) => {
        // if (result.value) {
        //     let fila = $('#datatables').dataTable().fnGetData($(this).closest('tr'));            
        //     let id = fila[0];            
        //     db.ref(`productos/${id}`).remove()
        //     Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.','success')
        // }
        // })  
        let fila = $('#datatables').dataTable().fnGetData($(this).closest('tr'));
        let id = fila[0];
        let typeRequest = fila[2];
        let message = fila[1];
        if ((typeRequest = 'bookRoomRequest')) {
            var result = window.confirm('Are you sure to cancel ' + message + ' ?')
            if (result) {
                //delete booking in db
                fetch(`http://localhost:5000/capstone-srms-thanhnt/us-central1/app/bookRoom/delete/${id}`, {
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                    },
                    method: 'DELETE',
                }).then(res => {
                    if (res.status === 200) {
                        return res.json().then(result => { console.log(result) })
                    }
                    else {
                        return res.json().then(result => { throw Error(result.error) });
                    }
                }).catch(e => {
                    console.log(e);
                });

            }
        }
    });


    $("#datatables").on("click", ".btnEditRequest", function() {    
        filaEditada = table.row($(this).parents('tr'));           
        let fila = $('#datatables').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
		
        //get data by id to update
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/bookRoom', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(bookingRoom)
        }).then(res => {
            if (res.status === 200) {
                // return res.json().then(result => { console.log(result) })
                console.log(res);
                this.setState({
                    txtDateToBook: '',
                    txtStartTime: '',
                    txtEndTime: '',
                    cbbRoomToBook: '',
                    txtReasonToBook: '',
                    isDisableBookingBtn: true,
                    isAgreeRuleBooking: false,
                    isShowValidateLoadEmptyRoom: false,
                    isAllowToLoadEmptyRooms: true,

                })
                // Array.from(document.querySelectorAll("input")).forEach(
                //     input => (input.value = "")
                //   );
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
       
	});  


}



