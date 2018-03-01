var board = {
  name: 'Tablica Kanban',
  createColumn: function(column) {
    this.element.append(column.element);
    initSortable();
  },
  element: $('#board .column-container')
};

$('.create-column')
  .click(function() {
      var columnName = prompt('Enter a column name');
      if(columnName){
        $.ajax({
          url: baseUrl + '/column',
          method: 'POST',
          data: {
                name: columnName
          },
          success: function(response){
            var column = new Column(response.id, columnName);
            board.createColumn(column);
          }
        });
      }  
  });
  
function initSortable() {
    $('.card-list').sortable({
        connectWith: '.card-list',
        placeholder: 'card-placeholder',
        forcePlaceholderSize: true,

        //ustawienie wysokości elementu przenoszonego
        start: function (event, ui) {
            ui.placeholder.height(ui.helper.outerHeight());
        },

        //przenoszenie karty do innej kolumny
        stop: function (event, ui ) {
            
            var toID = ui.item.parents('.column').attr('id'),
                itemID = ui.item.attr('id'),
                itemName = ui.item.children('.card-description').text();

            $.ajax({
                url: baseUrl + '/card/' + itemID,
                method: 'PUT',
                data: {
                    id: itemID,
                    name: itemName,
                    bootcamp_kanban_column_id: toID
                },
             
            });

        }
    }).disableSelection();
  }
