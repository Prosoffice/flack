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


n = int(input("Type in a number to see its collats: "))
print(collats(n))
