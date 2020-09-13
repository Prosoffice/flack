# This is a python file i am using to learn recursion, i just hope i master it in a week oh!
# I am adding a second line here to check it will save if i just press colon .


def collats(n):
    counter = 0
    if n == 1:
        return counter
    else:
        if n % 2 == 0:
            new_n = n/2
            counter+=1
            return counter +  collats(new_n)
        else:
            new_n = 3 * n + 1
            counter+=1
            return counter + collats(new_n)


def optional(n, freq=1):
    return(f'Your n is {n} and your second argument is now {freq}')

def main():

    n = int(input('Type in an n: '))

    question = input('Do you have an f?: ')

    if question == 'no':
        print(optional(n))

    elif question == 'yes':
        freq = int(input('What is your freq?: '))
        print(optional(n, freq))


main()
