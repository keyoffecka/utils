#Utils

A set of lightweight utilities that you may want to use to avoid adding dependencies on big libraries.

The utilities contain
## Optional
There are two types of optional objects:
* None - doesn't have a value. An attempt to get its value causes an error to be thrown.
* Some - always has the same value set at the moment when the Some object has been created.

##Future

Future object can be in two states: completed or not completed.

If the future is completed it is either succeeded or failed.

If the future has succeeded it has a value.

If the future has failed it has an error.

If a future is completed it cannot change its state to not completed,
or from succeeded to failed or from failed to succeeded.

An attempt to complete an already completed future causes an error to be thrown.

Future object has an internal bus, if a listener subscribes to listen events
it will receive a notification when the future completes.

If the future has already completed, the notification is sent immediately.

##Bus
A simple message bus which allows listeners to subscribe to a particular event type;
Event providers then use the same bu to notifier the listeners about an event.

#Building
This project uses ant+ivy to compile and test the library. You will also need
* npm,
* bower,
* and phantomjs executables.

To initialise the build system:

*ant retrieve*

Then

*ant*

##Notice
This was only tested in Linux