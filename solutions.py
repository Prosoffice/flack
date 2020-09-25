def solution(S):
    # Using brute force

    # Converting input to an array
    s_list = [char for char in S]

    # A variable to count number of ways the input can be split
    no_of_divisions = 0

    for char in s_list:
        if char == 'a':
            no_of_divisions += 1
            break

    return no_of_divisions


print(solution('aabbaba'))

k = 'b'
k.lo