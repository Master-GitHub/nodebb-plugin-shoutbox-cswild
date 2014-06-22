(function(Shoutbox) {
	var Archive = {
		register: function(shoutPanel) {
			var handle = this.handle,
				archiveModal = $('#shoutbox-archive-modal');

			shoutPanel.find('#shoutbox-button-archive').off('click').on('click', function(e) {
				handle(archiveModal, handle);
			});
			archiveModal.find('#shoutbox-button-archive-prev').off('click').on('click', function(e) {
				prev(archiveModal, handle);
			});
			archiveModal.find('#shoutbox-button-archive-next').off('click').on('click', function(e) {
				next(archiveModal, handle);
			});
		},
		handle: function(archiveModal, handle) {
			archiveModal.modal('show');
			if (!archiveModal.data('start')) {
				archiveModal.data('start', (-(Shoutbox.settings.get('shoutLimit') - 1)).toString());
				archiveModal.data('end', '-1');
			}
			get(archiveModal, handle);
		}
	};

	function prev(archiveModal, handle) {
		var shoutLimit = Shoutbox.settings.get('shoutLimit'),
			start = parseInt(archiveModal.data('start'), 10) - shoutLimit,
			end = parseInt(archiveModal.data('end'), 10) - shoutLimit;

		if (Math.abs(start) < (parseInt(Shoutbox.vars.lastSid, 10) + shoutLimit)) {
			archiveModal.data('start', start);
			archiveModal.data('end', end);

			get(archiveModal, handle);
		}
	}

	function next(archiveModal, handle) {
		var shoutLimit = Shoutbox.settings.get('shoutLimit'),
			start = parseInt(archiveModal.data('start'), 10) + shoutLimit,
			end = parseInt(archiveModal.data('end'), 10) + shoutLimit,
			startLimit = -(shoutLimit - 1);

		if (start <= startLimit && end < 0) {
			archiveModal.data('start', start);
			archiveModal.data('end', end);

			get(archiveModal, handle);
		}
	}

	function get(archiveModal, handle) {
		archiveModal.find('#shoutbox-archive-content').html('');
		var start = archiveModal.data('start'),
			end = archiveModal.data('end');

		Shoutbox.sockets.getShouts({ start: start, end: end }, function(err, shouts) {
			for(var i = 0; i < shouts.length; i++) {
				addShout(shouts[i], archiveModal);
			}
			archiveModal.find('.shoutbox-shout-options').remove();
		});
	}

	function addShout(shout, archiveModal) {
		if (shout && shout.sid) {
			var archiveContent = archiveModal.find('#shoutbox-archive-content');
			if (parseInt(shout.fromuid, 10) === archiveContent.find('[data-uid]:last').data('uid')) {
				archiveContent.find('[data-sid]:last').after(Shoutbox.utils.parseShout(shout, true));
			} else {
				archiveContent.append(Shoutbox.utils.parseShout(shout));
			}
			Shoutbox.utils.scrollToBottom(archiveContent);
		}
	}

	Shoutbox.actions.register(Archive);
})(window.Shoutbox);