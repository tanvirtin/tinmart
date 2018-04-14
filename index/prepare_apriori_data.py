from models import Transaction
from mongoengine import register_connection

if __name__ == '__main__':

    register_connection('tinmart', 'tinmart')

    # get all transactions
    transactions = Transaction.objects.all()

    file_path = './data/apriori_data.dat';

    print('Creating apriori data...')
    with open(file_path, 'w') as apriori_data:
        for transaction in transactions:
            products = transaction['products']
            for product in products:
                product = str(product)
                apriori_data.write(product)
                apriori_data.write(' ')
            apriori_data.write('\n')
    print('Apriori data creation complete...')