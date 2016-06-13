$('#startGame').on('click', function() {
  var name = $('#nameInput').val();
  $('#nameDiv').addClass('hide');
  $('#chatDiv').removeClass('hide');
  $('#playerName').html('<b>' + name + '</b>');
  return false;
})