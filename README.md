Meetingify Agenda Organizer
====================
This is a fully fledged HTML5/Javascript Web App to prepare and organize meetings. You
can see a demo in English, Spanish and German live on the web with a free login on
[meetingify.orga.zone](https://meetingify.orga.zone/ "Meeting Organizer").

It uses the orga.zone APIv2 as a backend to store data and synchronize between devices.

![Meeting List](https://orga.zone/images/meetingify-screen.png)

The app works well on all modern browsers and was tested with Chrome, Firefox, Safari and Edge.
With the use of the AppCache aka manifest file, it also works offline locally up to
the point where you might want to sync your meeting settings up.

Free accounts on orga.zone are limited to 10 meetings per account.

Reuse for your own
--------------------

We welcome developers to reuse our code and snippets of the meetingify app in their
own projects. The highlights of this Javascript App are:

*   Manifest or AppCache usage to work offline
*   Data synchronization with the API via simple REST calls
*   localStorage handling with filling the local database with remote data
*   Translation of the pages in 3 different languages

and there are many more small and big ideas hidden in this pure Javascript powertool,
including image upload and sending eMail from within the Javascript app.

The APIv2 for speedy REST calls is documented on orga.zone: [Javascript REST APIv2](https://docs.orga.zone/ "Javascript APIv2")

Here on github or there on our site you may also get in touch with me or follow me on Twitter under @orgaralf.


3rd Party Software
---------------------

This app includes AngularJS, jQuery and some other Javascript libraries within the project. It comes
under the GPLv2, which is attached to this package in the source code.

For the 3rd party licenses, please refer to the respective package contained. We have
explicitly only used Open Source packages to create this software.