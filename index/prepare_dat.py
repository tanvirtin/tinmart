from models import Transaction
from mongoengine import register_connection
from apyori import apriori
import time

if __name__ == '__main__':
    file_name = './data/apriori_data.dat'

    register_connection('tinmart', 'tinmart')
    # get all transactions
    transactions = Transaction.objects.all()
    apriori_transactions = [[product for product in transaction['products']] for transaction in transactions]


    with open(file_name, 'w') as file:
        for transaction in apriori_transactions:
            for item in transaction:
                file.write(str(item))
                file.write(' ')
            
            file.write('\n')