class Notification {
	constructor(){
		this.notification_block = document.querySelector('.alert-info');
		this.hide = this.hide.bind(this);
	}
	show(text){
		this.notification_block.innerHTML = text;
		this.notification_block.classList.add('show');
		
		setTimeout( this.hide, 2000 );
	}

	hide(){
		this.notification_block.classList.remove('show');
	}
}