# a class that will represent a JSON error object which gets sent to users upon a communication error
class Error(object):

    def __init__(self, status = None, message = None):
        self.status = status
        self.message = message

    def __str__(self):
        return self.status
