$(document).ready(function() {
    // Setup - add a text input to each footer cell
    $('#table tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );
 
    // DataTable
    var table = $('#table').DataTable({
        initComplete: function () 
        {
          
            // Apply the search
            this.api().columns().every( function () {
                var that = this;
 
                $( 'input', this.footer() ).on( 'keyup change clear', function () {
                    if ( that.search() !== this.value ) {
                        that
                            .search( this.value )
                            .draw();
                    }
                } );
            } );
            var r = $('#table tfoot tr');
            r.find('th').each(function(){
                $(this).css('padding', 8);
            });
            $('#table thead').append(r);
            $('#search_0').css('text-align', 'center');
        }
    });
 
} );